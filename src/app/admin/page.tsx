import { prisma } from "@/lib/db";
import { Users, FileText, Heart, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // ป้องกัน Next.js cache หน้า Dashboard เพื่อให้เห็นตัวเลขจริงตลอดเวลา

export default async function AdminDashboard() {
  // ดึงสถิติจริงจากตาราง DB
  const [
    totalUsers,
    totalReviews,
    totalComments,
    totalLikes,
    recommenders,
    readers,
    latestUsers,
    latestReviews
  ] = await Promise.all([
    prisma.user.count(),
    prisma.review.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.user.count({ where: { role: "recommender" } }),
    prisma.user.count({ where: { role: "reader" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        company: { select: { name: true } },
      },
    }),
  ]);

  const cards = [
    {
      title: "สมาชิกทั้งหมด",
      value: totalUsers.toLocaleString(),
      desc: `ผู้แนะนำ: ${recommenders} | ผู้อ่าน: ${readers}`,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "โพสต์รีวิวทั้งหมด",
      value: totalReviews.toLocaleString(),
      desc: "รีวิวสถานที่ฝึกงานและทำงานจริง",
      icon: FileText,
      color: "bg-emerald-500",
    },
    {
      title: "ยอดความคิดเห็นสะสม",
      value: totalComments.toLocaleString(),
      desc: "บทสนทนาแลกเปลี่ยนบนเว็บ",
      icon: MessageSquare,
      color: "bg-violet-500",
    },
    {
      title: "การกดถูกใจสะสม",
      value: totalLikes.toLocaleString(),
      desc: "ยอดความพึงพอใจและชื่นชอบ",
      icon: Heart,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight" data-font="ui">
            หน้าแดชบอร์ดหลัก
          </h1>
          <p className="text-sm text-slate-500 mt-1">ยินดีต้อนรับกลับมา! ตรวจสอบสถิติและความเคลื่อนไหวล่าสุดของระบบ GIntern</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>เชื่อมต่อฐานข้อมูล TiDB Cloud สำเร็จ</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800 tracking-tight" data-font="ui">
                  {card.value}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">{card.desc}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-200/20`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Grid - Latest Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-sm" data-font="ui">สมาชิกใหม่ล่าสุด 5 รายการ</h2>
            <Link href="/admin/users" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">ชื่อ</th>
                  <th className="px-5 py-3">บทบาท</th>
                  <th className="px-5 py-3">วันที่สมัคร</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {latestUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>
                        <p className="truncate max-w-[150px]">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.role === "admin" ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-semibold">แอดมิน</span>
                      ) : user.role === "recommender" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold">ผู้แนะนำ</span>
                      ) : user.role === "reader" ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold">ผู้อ่าน</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">ยังไม่เลือก</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-sm" data-font="ui">โพสต์รีวิวล่าสุด 5 รายการ</h2>
            <Link href="/admin/reviews" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">บริษัท / ตำแหน่ง</th>
                  <th className="px-5 py-3">ผู้เขียน</th>
                  <th className="px-5 py-3">วันที่เขียน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {latestReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>
                        <p className="truncate max-w-[150px]">{review.company.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{review.position}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium">{review.user.name}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
