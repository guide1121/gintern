import { prisma } from "@/lib/db";
import { MessageSquare, Inbox, ShieldAlert } from "lucide-react";
import { DeleteFeedbackButton } from "./DeleteFeedbackButton";

export const revalidate = 0; // ป้องกัน Cache หน้า Admin เพื่อให้เห็นข้อมูลปัจจุบันเสมอ

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight" data-font="ui">
            จัดการข้อเสนอแนะและ Feedback
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ดูและบริหารจัดการข้อความติดต่อ ความคิดเห็น และข้อเสนอแนะที่ผู้ใช้ส่งมาจากหน้าติดต่อเรา
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 w-fit">
          <Inbox className="w-4 h-4 text-slate-600" />
          <span data-font="ui">ทั้งหมด {feedbacks.length} รายการ</span>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {feedbacks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="px-6 py-4 w-44">ผู้ติดต่อ</th>
                  <th className="px-6 py-4 w-48">หัวเรื่อง</th>
                  <th className="px-6 py-4">ข้อความรายละเอียด</th>
                  <th className="px-6 py-4 w-32">วันที่ส่ง</th>
                  <th className="px-6 py-4 w-20 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4 font-medium text-slate-800 align-top">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 break-words max-w-[150px]">{item.name}</p>
                        <p className="text-[10px] text-slate-400 break-all max-w-[150px]">{item.email}</p>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4 font-medium text-slate-700 align-top break-words max-w-[180px]">
                      {item.subject || <span className="text-slate-300 font-normal">ไม่มีระบุ</span>}
                    </td>

                    {/* Message Detail */}
                    <td className="px-6 py-4 align-top text-slate-600 leading-relaxed break-words whitespace-pre-wrap max-w-sm">
                      {item.message}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-slate-400 align-top whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <p className="text-[10px] text-slate-400/80 mt-0.5">
                        {new Date(item.createdAt).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} น.
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center align-top">
                      <div className="flex items-center justify-center">
                        <DeleteFeedbackButton id={item.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-500" />
            <h2 className="text-lg font-medium text-slate-700 mb-1" data-font="ui">
              ไม่มีข้อมูลข้อเสนอแนะ
            </h2>
            <p className="text-xs text-slate-400">ยังไม่มีใครเขียนส่งข้อเสนอแนะหรือติดต่อเข้ามาในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
