"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// กำหนดค่าการเชื่อมต่อ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ฟังก์ชันแกะ Public ID จาก Cloudinary URL เพื่อใช้ลบไฟล์รูปภาพเก่า
function getCloudinaryPublicId(url: string): string | null {
  if (!url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/image/upload/");
    if (parts.length < 2) return null;
    
    const pathParts = parts[1].split("/");
    // ข้ามเวอร์ชันแท็ก เช่น v1721832049
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    
    const fullPath = pathParts.join("/");
    const extIndex = fullPath.lastIndexOf(".");
    if (extIndex !== -1) {
      return fullPath.substring(0, extIndex);
    }
    return fullPath;
  } catch (e) {
    console.error("Error parsing Cloudinary public id:", e);
    return null;
  }
}

// ฟังก์ชันอัปโหลดรูปภาพผ่าน Stream เข้า Cloudinary
async function uploadToCloudinary(file: File, userId: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "gintern/avatars",
        public_id: `avatar-${userId}-${Date.now()}`,
        // ตัดรูปหน้าโปรไฟล์แบบจัตุรัสและจับศูนย์กลางที่ใบหน้าคนอัตโนมัติ (Face Detection)
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    ).end(buffer);
  });
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user || !session.user.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  // ตรวจสอบว่าได้ตั้งค่าคีย์เชื่อมต่อ Cloudinary แล้วหรือยัง
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return { error: "กรุณาตั้งค่าตัวแปรสภาพแวดล้อม Cloudinary ในไฟล์ .env ของโครงการให้ครบถ้วนก่อนใช้งาน" };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const studyPlace = formData.get("studyPlace") as string;
  const workPlace = formData.get("workPlace") as string;
  const fieldOfStudy = formData.get("fieldOfStudy") as string;
  const instagram = formData.get("instagram") as string;
  const facebook = formData.get("facebook") as string;
  const deleteAvatar = formData.get("deleteAvatar") as string; // "true" or "false"
  const avatarFile = formData.get("avatarFile") as File | null;
  const showBadges = formData.get("showBadges") === "true";

  if (!name || name.trim() === "") {
    return { error: "กรุณากรอกชื่อแสดงตัวตน" };
  }

  try {
    // 1. ดึงข้อมูลผู้ใช้จาก DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, image: true }
    });

    if (!user) {
      return { error: "ไม่พบผู้ใช้ในระบบ" };
    }

    let finalImageUrl = user.image;

    // 2. ตรวจสอบการอัปโหลดไฟล์รูปภาพใหม่
    if (avatarFile && avatarFile.size > 0) {
      if (avatarFile.size > 2 * 1024 * 1024) {
        return { error: "ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB" };
      }

      if (!avatarFile.type.startsWith("image/")) {
        return { error: "ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น" };
      }

      // อัปโหลดเข้า Cloudinary
      const uploadedUrl = await uploadToCloudinary(avatarFile, user.id);

      // ลบรูปภาพเก่าใน Cloudinary ออกถ้ามี
      if (user.image) {
        const oldPublicId = getCloudinaryPublicId(user.image);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
          } catch (e) {
            console.warn("Could not delete old Cloudinary avatar:", e);
          }
        }
      }

      finalImageUrl = uploadedUrl;
    } else if (deleteAvatar === "true") {
      // ลบรูปภาพใน Cloudinary ออกถ้าสั่งลบ
      if (user.image) {
        const oldPublicId = getCloudinaryPublicId(user.image);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
          } catch (e) {
            console.warn("Could not delete old Cloudinary avatar:", e);
          }
        }
      }
      finalImageUrl = null;
    }

    // 3. ทำการบันทึกข้อมูลในฐานข้อมูล
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        bio: bio ? bio.trim() : null,
        studyPlace: studyPlace ? studyPlace.trim() : null,
        workPlace: workPlace ? workPlace.trim() : null,
        fieldOfStudy: fieldOfStudy ? fieldOfStudy.trim() : null,
        instagram: instagram ? instagram.trim() : null,
        facebook: facebook ? facebook.trim() : null,
        image: finalImageUrl,
        showBadges: showBadges,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function saveUserRole(role: string) {
  const session = await auth();
  if (!session?.user || !session.user.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  if (role !== "recommender" && role !== "reader") {
    return { error: "บทบาทการใช้งานไม่ถูกต้อง" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Save role error:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกบทบาท กรุณาลองใหม่อีกครั้ง" };
  }
}
