import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ReviewForm } from "./ReviewForm";
import { prisma } from "@/lib/db";

type PageProps = {
  searchParams: Promise<{ editId?: string }>;
};

export default async function NewReviewPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const editId = resolvedParams.editId;
  let initialReviewData = null;

  if (editId) {
    const review = await prisma.review.findUnique({
      where: { id: editId },
      include: { company: true },
    });

    if (review) {
      // ตรวจสอบสิทธิ์: หากไม่ใช่เจ้าของรีวิว ให้ดีดกลับหน้าหลัก
      if (review.userId !== dbUser.id) {
        redirect("/");
      }

      initialReviewData = {
        id: review.id,
        companyName: review.company.name,
        industry: review.company.industry,
        position: review.position,
        experienceType: review.experienceType,
        ratingMentor: review.ratingMentor,
        ratingLearning: review.ratingLearning,
        ratingWorkload: review.ratingWorkload,
        ratingCulture: review.ratingCulture,
        pay: review.pay ? String(review.pay) : "",
        payType: review.payType || "บาท/เดือน",
        content: review.content,
        isAnonymous: review.isAnonymous,
      };
    }
  }

  return (
    <>
      <Navbar user={dbUser} />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <ReviewForm initialData={initialReviewData} />
      </main>
    </>
  );
}
