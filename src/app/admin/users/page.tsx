import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserTable } from "./UserTable";

export const revalidate = 0; // ป้องกัน Cache

export default async function AdminUsersPage() {
  const session = await auth();

  // ดึงข้อมูลสมาชิกทั้งหมด เรียงตามวันที่สมัครล่าสุด
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight" data-font="ui">
          จัดการบัญชีสมาชิก
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          เรียกดูรายชื่อสมาชิกทั้งหมด ค้นหาข้อมูลสมาชิก และดำเนินการลบบัญชีที่ไม่เหมาะสมออกจากระบบ
        </p>
      </div>

      <UserTable users={users} currentAdminEmail={session?.user?.email} />
    </div>
  );
}
