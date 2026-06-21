"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/admin";
import { Search, Trash2, Shield, GraduationCap, BookOpen, AlertTriangle, Loader2 } from "lucide-react";

type UserType = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  createdAt: Date;
};

type Props = {
  users: UserType[];
  currentAdminEmail: string | null | undefined;
};

export function UserTable({ users, currentAdminEmail }: Props) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // กรองตามการค้นหา
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(userId: string) {
    setError(null);
    setDeletingId(userId);

    try {
      const res = await deleteUser(userId);
      if (res?.error) {
        setError(res.error);
        setDeletingId(null);
        setShowConfirmId(null);
      } else {
        // เมื่อลบสำเร็จ รีเฟรชโดยใช้ window.location.reload()
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
            placeholder="ค้นหาชื่อหรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium" data-font="ui">
          พบสมาชิกทั้งหมด {filteredUsers.length} รายการ
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs">
                <th className="px-6 py-4">โปรไฟล์ / ชื่อ</th>
                <th className="px-6 py-4">อีเมล</th>
                <th className="px-6 py-4">บทบาท</th>
                <th className="px-6 py-4">วันที่สมัคร</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredUsers.map((user) => {
                const initials = (user.name || "?").charAt(0).toUpperCase();
                const isSelf = user.email === currentAdminEmail;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm select-none" data-font="ui">
                            {initials}
                          </div>
                        )}
                        <span className="font-semibold text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          <Shield className="w-3 h-3 text-rose-600" />
                          แอดมิน
                        </span>
                      ) : user.role === "recommender" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <GraduationCap className="w-3 h-3 text-emerald-600" />
                          ผู้แนะนำ
                        </span>
                      ) : user.role === "reader" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          ผู้อ่าน
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-400">
                          ยังไม่เลือก
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSelf ? (
                        <span className="text-xs text-slate-400 italic">บัญชีของคุณ</span>
                      ) : (
                        <button
                          onClick={() => setShowConfirmId(user.id)}
                          className="text-rose-300 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="ลบสมาชิก"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic bg-white" data-font="ui">
                    ไม่พบสมาชิกที่ตรงตามเกณฑ์ค้นหา
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
              ยืนยันการลบบัญชีสมาชิก
            </h3>
            <p className="text-center text-slate-500 text-xs mt-2 leading-relaxed" style={{ textWrap: "pretty" }}>
              การลบบัญชีนี้จะส่งผลให้ข้อมูลโพสต์รีวิว ความคิดเห็น และยอดถูกใจทั้งหมดของผู้ใช้นี้ถูกลบออกจากระบบอย่างถาวรและไม่สามารถกู้คืนได้
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
