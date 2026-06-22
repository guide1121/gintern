"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export type CreateReviewInput = {
  companyName: string;
  industry: string;
  position: string;
  experienceType: string;
  ratingMentor: number;
  ratingLearning: number;
  ratingWorkload: number;
  ratingCulture: number;
  pay: number | null;
  payType: string | null;
  content: string;
  isAnonymous: boolean;
};

export async function createReview(data: CreateReviewInput) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const {
    companyName,
    industry,
    position,
    experienceType,
    ratingMentor,
    ratingLearning,
    ratingWorkload,
    ratingCulture,
    pay,
    payType,
    content,
    isAnonymous,
  } = data;

  if (!companyName || !position || !experienceType || !content) {
    return { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
  }

  try {
    const formattedCompanyName = companyName.trim();
    let company = await prisma.company.findUnique({
      where: { name: formattedCompanyName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: formattedCompanyName,
          industry: industry.trim() || "อื่นๆ",
        },
      });
    }

    const ratingOverall = (ratingMentor + ratingLearning + ratingWorkload + ratingCulture) / 4;

    await prisma.review.create({
      data: {
        userId: user.id,
        companyId: company.id,
        position: position.trim(),
        experienceType,
        ratingOverall,
        ratingMentor,
        ratingLearning,
        ratingWorkload,
        ratingCulture,
        pay,
        payType,
        content: content.trim(),
        isAnonymous,
      },
    });

    revalidatePath("/");
    revalidateTag("recent-reviews", "max");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create review:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateReview(reviewId: string, data: CreateReviewInput) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const {
    companyName,
    industry,
    position,
    experienceType,
    ratingMentor,
    ratingLearning,
    ratingWorkload,
    ratingCulture,
    pay,
    payType,
    content,
    isAnonymous,
  } = data;

  if (!companyName || !position || !experienceType || !content) {
    return { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
  }

  try {
    // ดึงข้อมูลรีวิวเดิมขึ้นมาตรวจสอบสิทธิ์
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { error: "ไม่พบรีวิวที่ต้องการแก้ไข" };
    }

    if (review.userId !== user.id) {
      return { error: "คุณไม่มีสิทธิ์แก้ไขรีวิวชิ้นนี้" };
    }

    const formattedCompanyName = companyName.trim();
    let company = await prisma.company.findUnique({
      where: { name: formattedCompanyName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: formattedCompanyName,
          industry: industry.trim() || "อื่นๆ",
        },
      });
    }

    const ratingOverall = (ratingMentor + ratingLearning + ratingWorkload + ratingCulture) / 4;

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        companyId: company.id,
        position: position.trim(),
        experienceType,
        ratingOverall,
        ratingMentor,
        ratingLearning,
        ratingWorkload,
        ratingCulture,
        pay,
        payType,
        content: content.trim(),
        isAnonymous,
      },
    });

    revalidatePath("/");
    revalidateTag("recent-reviews", "max");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update review:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function toggleLike(reviewId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: reviewId,
        },
      },
    });

    if (existingLike) {
      // เอาไลก์ออก
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // เพิ่มไลก์
      await prisma.like.create({
        data: {
          userId: user.id,
          reviewId: reviewId,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidateTag("recent-reviews", "max");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { error: "เกิดข้อผิดพลาดในการประมวลผลถูกใจ" };
  }
}

export async function addComment(reviewId: string, content: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: "กรุณากรอกข้อความแสดงความคิดเห็น" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        userId: user.id,
        reviewId: reviewId,
        content: trimmedContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/");
    revalidateTag("recent-reviews", "max");
    return { success: true, comment: newComment };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { error: "เกิดข้อผิดพลาดในการส่งความคิดเห็น" };
  }
}

export async function deleteReview(reviewId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { error: "ไม่พบรีวิวที่ต้องการลบ" };
    }

    if (review.userId !== user.id && user.role !== "admin") {
      return { error: "คุณไม่มีสิทธิ์ลบรีวิวชิ้นนี้" };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidateTag("recent-reviews", "max");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { error: "เกิดข้อผิดพลาดในการลบรีวิว กรุณาลองใหม่อีกครั้ง" };
  }
}
