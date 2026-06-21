"use client";

import { useState } from "react";
import { saveUserRole } from "@/app/actions/profile";
import { GraduationCap, BookOpen, Loader2, ArrowRight } from "lucide-react";

type RoleOption = "recommender" | "reader";

export function RoleSelectionForm() {
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!selectedRole) return;
    setLoading(true);
    setError(null);

    try {
      const res = await saveUserRole(selectedRole);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // นำทางไปยังหน้าแรกของเว็บไซต์โดยตรงเพื่อล้างแคช
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-xl font-medium text-ink" data-font="ui">
          ยินดีต้อนรับสู่ GIntern! 🎉
        </h1>
        <p className="text-sm text-muted mt-2">
          เลือกบทบาทการเข้าใช้งานของคุณ เพื่อเริ่มต้นการเดินทาง
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-medium" data-font="ui">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* Recommender Card */}
        <button
          type="button"
          onClick={() => setSelectedRole("recommender")}
          className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer hover:scale-[1.01] ${
            selectedRole === "recommender"
              ? "border-primary bg-primary-light/10 ring-2 ring-primary-light/50"
              : "border-border hover:border-primary-light/50 bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-primary-light text-primary-ink flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-ink text-base" data-font="ui">
              ฉันคือ "ผู้แนะนำ" (Recommender)
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed" style={{ textWrap: "pretty" }}>
              รุ่นพี่ผู้ใจดีที่พร้อมเข้ามาแบ่งปันประสบการณ์การฝึกงานหรือชีวิตการทำงานจริง เพื่อนำทางและส่งต่อประโยชน์ให้แก่รุ่นน้อง
            </p>
          </div>
        </button>

        {/* Reader Card */}
        <button
          type="button"
          onClick={() => setSelectedRole("reader")}
          className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer hover:scale-[1.01] ${
            selectedRole === "reader"
              ? "border-accent bg-accent/5 ring-2 ring-accent/20"
              : "border-border hover:border-accent/40 bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-primary-light/30 text-accent-ink flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-ink text-base" data-font="ui">
              ฉันคือ "ผู้อ่าน" (Reader)
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed" style={{ textWrap: "pretty" }}>
              ผู้ใช้งานทั่วไปหรือรุ่นน้องที่ต้องการศึกษา ค้นหารีวิวการทำงาน/การฝึกงานตามความจริงจากรุ่นพี่ตัวจริงเพื่อประกอบการตัดสินใจ
            </p>
          </div>
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!selectedRole || loading}
        className="w-full bg-primary text-primary-ink py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        data-font="ui"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>กำลังบันทึกข้อมูล...</span>
          </>
        ) : (
          <>
            <span>เริ่มต้นใช้งาน GIntern</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
