"use client";

import { useState } from "react";
import { deleteReview } from "@/app/actions/admin";
import { Search, Trash2, Star, AlertTriangle, Loader2 } from "lucide-react";

type ReviewType = {
  id: string;
  position: string;
  experienceType: string;
  ratingOverall: number;
  createdAt: Date;
  company: {
    name: string;
  };
  user: {
    name: string;
    email: string;
  };
};

type Props = {
  reviews: ReviewType[];
};

export function ReviewTable({ reviews }: Props) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredReviews = reviews.filter(
    (r) =>
      r.company.name.toLowerCase().includes(search.toLowerCase()) ||
      r.position.toLowerCase().includes(search.toLowerCase()) ||
      r.user.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(reviewId: string) {
    setError(null);
    setDeletingId(reviewId);

    try {
      const res = await deleteReview(reviewId);
      if (res?.error) {
        setError(res.error);
        setDeletingId(null);
        setShowConfirmId(null);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setDeletingId(null);
      setShowConfirmId(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-sm font-medium" data-font="ui">
          ⚠️ {error}
        </div>
      )}

      {/* Control Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาบริษัท, ตำแหน่ง, ผู้เขียน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium" data-font="ui">
          พบโพสต์รีวิวทั้งหมด {filteredReviews.length} รายการ
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs">
                <th className="px-6 py-4">บริษัท / ตำแหน่ง</th>
                <th className="px-6 py-4">ประเภทงาน</th>
                <th className="px-6 py-4">คะแนน</th>
                <th className="px-6 py-4">ผู้เขียน</th>
                <th className="px-6 py-4">วันที่เขียน</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <div>
                      <p className="font-semibold text-slate-850">{review.company.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{review.position}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {review.experienceType === "intern" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ฝึกงาน
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        ทำงานจริง
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-800" data-font="ui">
                        {review.ratingOverall}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{review.user.name}</p>
                      <p className="text-[10px] text-slate-400">{review.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShowConfirmId(review.id)}
                      className="text-rose-300 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label="ลบโพสต์รีวิว"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic bg-white" data-font="ui">
                    ไม่พบรีวิวที่ตรงตามเกณฑ์ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-bold text-slate-800 text-base" data-font="ui">
              ยืนยันการลบโพสต์รีวิว
            </h3>
            <p className="text-center text-slate-500 text-xs mt-2 leading-relaxed" style={{ textWrap: "pretty" }}>
              คุณกำลังจะดำเนินการลบโพสต์รีวิวนี้ออกจากระบบอย่างถาวร ข้อมูลไลก์ ความคิดเห็นย่อยทั้งหมดที่ผูกกับรีวิวนี้จะถูกลบไปด้วยและไม่สามารถเรียกคืนได้
            </p>
            <div className="flex gap-3 mt-6" data-font="ui">
              <button
                disabled={deletingId !== null}
                onClick={() => setShowConfirmId(null)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer bg-white"
              >
                ยกเลิก
              </button>
              <button
                disabled={deletingId !== null}
                onClick={() => handleDelete(showConfirmId)}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังลบ...</span>
                  </>
                ) : (
                  <span>ลบอย่างถาวร</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
