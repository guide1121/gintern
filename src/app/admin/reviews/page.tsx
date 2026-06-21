import { prisma } from "@/lib/db";
import { ReviewTable } from "./ReviewTable";

export const revalidate = 0; // ป้องกัน Cache

export default async function AdminReviewsPage() {
  // ดึงข้อมูลรีวิวทั้งหมดเรียงจากสร้างใหม่ล่าสุด
  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      company: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight" data-font="ui">
          จัดการโพสต์รีวิว
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          เรียกดูรีวิวทั้งหมดที่ถูกโพสต์บนระบบ ค้นหาโพสต์ คัดกรองและดำเนินการลบโพสต์รีวิวที่ไม่เหมาะสม
        </p>
      </div>

      <ReviewTable reviews={reviews} />
    </div>
  );
}
