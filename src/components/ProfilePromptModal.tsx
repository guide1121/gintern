"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

type ProfilePromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProfilePromptModal({ isOpen, onClose }: ProfilePromptModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-border/80 overflow-hidden animate-modal-zoom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-muted hover:text-ink rounded-xl hover:bg-surface-hover/80 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center mt-3">
          {/* Mock Profile Completion Card (Asymmetric/Non-AI Premium Illustration) */}
          <div className="w-64 bg-surface rounded-2xl p-4 border border-border/80 shadow-md flex items-center gap-3.5 mb-6 text-left transition-shadow duration-200 hover:shadow-lg">
            <div className="w-11 h-11 rounded-full border-2 border-dashed border-muted/30 bg-primary-light/10 flex items-center justify-center text-muted/65 shrink-0 select-none">
              <UserPlus className="w-5 h-5 text-muted/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink truncate mb-1" data-font="ui">
                โปรไฟล์ของคุณ
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted font-medium mb-1" data-font="ui">
                <span>กรอกไปแล้ว 40%</span>
                <span className="text-primary-ink font-semibold">ขาดอีก 60%</span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-ink tracking-wide font-ui" data-font="ui">
            ยินดีต้อนรับสู่ GIntern!
          </h2>
          
          <p className="text-sm text-muted mt-3 leading-relaxed" style={{ textWrap: "pretty" }}>
            เพื่อช่วยให้คุณสามารถค้นหาข้อมูลที่ตรงใจ หรือร่วมแบ่งปันประสบการณ์ฝึกงานกับรุ่นน้องได้อย่างรวดเร็ว มาร่วมทำโปรไฟล์ของคุณให้สมบูรณ์กันเถอะ
          </p>

          {/* Alert badge/info */}
          <div className="w-full mt-5 p-3.5 bg-surface/50 rounded-xl border border-border/40 text-xs text-left text-muted leading-relaxed">
            การเพิ่มข้อมูล <strong className="text-ink font-semibold">มหาวิทยาลัย คณะ</strong> หรือ <strong className="text-ink font-semibold">สถานที่ฝึกงาน</strong> จะช่วยจัดสรรข้อมูลแนะนำที่ตอบโจทย์ความสนใจของคุณได้เหมาะสมที่สุด
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-6 w-full">
          <Link
            href="/profile/edit"
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-hover text-primary-ink py-3 px-4 rounded-xl font-medium transition-shadow duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
            data-font="ui"
          >
            <span>ไปกรอกข้อมูลโปรไฟล์เลย</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <button
            onClick={onClose}
            className="w-full text-muted hover:text-ink hover:bg-surface-hover/50 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            data-font="ui"
          >
            ไว้กรอกทีหลัง
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalZoom {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-zoom {
          animation: modalZoom 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
