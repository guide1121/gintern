"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || !session.user.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ", isAdmin: false };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    return { error: "สิทธิ์ไม่เพียงพอในการดำเนินการ (ต้องการสิทธิ์ผู้ดูแลระบบ)", isAdmin: false };
  }

  return { isAdmin: true };
}

export async function deleteUser(userId: string) {
  const check = await checkAdmin();
  if (!check.isAdmin) {
    return { error: check.error || "สิทธิ์ไม่เพียงพอ" };
  }

  try {
    // ลบ User (เนื่องจากมี onDelete: Cascade ข้อมูลโพสต์ ความคิดเห็น และยอดถูกใจทั้งหมดจะถูกลบไปด้วยโดยอัตโนมัติ)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้ กรุณาลองใหมี่อีกครั้ง" };
  }
}

export async function deleteReview(reviewId: string) {
  const check = await checkAdmin();
  if (!check.isAdmin) {
    return { error: check.error || "สิทธิ์ไม่เพียงพอ" };
  }

  try {
    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete review error:", error);
    return { error: "เกิดข้อผิดพลาดในการลบรีวิว กรุณาลองใหมี่อีกครั้ง" };
  }
}
