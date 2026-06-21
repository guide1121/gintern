"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateFeedbackInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function createFeedback(data: CreateFeedbackInput) {
  const { name, email, subject, message } = data;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    return { success: true, feedback };
  } catch (error: any) {
    console.error("Failed to save feedback:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function deleteFeedback(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    return { error: "คุณไม่มีสิทธิ์ในการจัดการส่วนนี้" };
  }

  try {
    await prisma.feedback.delete({
      where: { id },
    });
    revalidatePath("/admin/feedback");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete feedback:", error);
    return { error: "เกิดข้อผิดพลาดในการลบข้อมูล" };
  }
}
