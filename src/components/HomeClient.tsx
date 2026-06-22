"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Search, PenLine, Building2, ShieldCheck, ArrowRight, Star, Coins, MessageSquare } from "lucide-react";
import { ReviewCard, Review } from "@/components/ReviewFeed";
import { ReviewModal } from "@/components/ReviewModal";

type Props = {
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
  recentReviews: Review[];
};

export function HomeClient({ user, recentReviews }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Keyboard Shortcut: กด / เพื่อโฟกัสช่องค้นหาหลัก
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true";
      if (e.key === "/" && !isInput) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // คำสำหรับแสดงผลใน Hero Header
  const words = ["Get", "Good", "Go", "Growth"];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReduced(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (isReduced) {
      setCurrentText(words[wordIndex]);
      const timer = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2500);
      return () => clearTimeout(timer);
    }

    let timer: NodeJS.Timeout;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }, 75);
      }
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, 150);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, isReduced]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-bg to-accent-pale/60 py-20 sm:py-28 relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none opacity-70" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none opacity-70" />
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h1
            className="text-5xl sm:text-6xl font-bold text-ink mb-6 flex items-center justify-center select-none text-center"
            style={{ letterSpacing: "-0.02em", textWrap: "balance" }}
            data-font="ui"
          >
            <span className="text-primary-ink">{currentText}</span>
            {!isReduced && (
              <span className="font-light cursor-blink text-primary-ink -ml-0.5">|</span>
            )}
            <span className="text-slate-800 ml-2">Intern</span>
          </h1>

          <h2
            className="text-xl sm:text-2xl font-medium text-ink/80 mb-3 animate-fade-in"
            style={{ textWrap: "balance" }}
          >
            รีวิวฝึกงานจากรุ่นพี่ตัวจริง
          </h2>
          <p className="text-muted text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            ค้นหาประสบการณ์จริงจากรุ่นพี่ในสายงานต่างๆ ปลอดภัย โปร่งใส
            <br />
            ไขทุกข้อข้องใจก่อนตัดสินใจเข้าฝึกงานจริง
          </p>

          {/* Quick Search Form */}
          <form action="/search" method="GET" className="relative max-w-xl mx-auto mb-8">
            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="ค้นหาบริษัทหรือตำแหน่งงาน"
              placeholder="ค้นหาบริษัท, ตำแหน่ง หรือสายงานที่สนใจ..."
              className="w-full bg-white rounded-xl px-5 py-4 pl-12 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary shadow-md focus:shadow-lg transition-all duration-200 text-base min-h-[44px]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-ink px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
              data-font="ui"
            >
              ค้นหา
            </button>
          </form>

          {user && (
            <div className="flex justify-center">
              <Link
                href="/review/new"
                className="inline-flex items-center gap-2 bg-white text-ink border border-border px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200 min-h-[44px]"
                data-font="ui"
              >
                <PenLine className="w-4 h-4 text-primary" />
                <span>เขียนรีวิวประสบการณ์ของคุณ</span>
              </Link>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cursor-blink {
            animation: cursorBlink 0.8s step-end infinite;
          }
        `}} />
      </section>

      {/* Main Core Features Highlight */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary-light/50 px-3 py-1 rounded-full" data-font="ui">
            ทำไมต้องใช้ GIntern?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-3" data-font="ui">
            แพลตฟอร์มที่เชื่อมโลกการฝึกงานให้โปร่งใส
          </h2>
          <p className="text-muted text-sm mt-3">
            เราสร้างระบบนี้ขึ้นมาเพื่อช่วยแก้ปัญหาความไม่ชัดเจน และยกระดับสิทธิประโยชน์ที่นักศึกษาควรได้รับ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
            <div>
              <div className="w-11 h-11 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
              <p className="text-muted text-sm leading-relaxed">
                เลือกรักษาความเป็นส่วนตัวของคุณได้ 100% ปิดบังตัวตนและรูปโปรไฟล์ ทั้งตอนรีวิวและคอมเมนต์เพื่อแชร์มุมมองจริงได้ปลอดภัยที่สุด
              </p>
            </div>
            <Link href="/about" className="text-sm font-semibold text-primary-ink hover:text-primary mt-4 flex items-center gap-1 w-fit" data-font="ui">
              <span>อ่านเพิ่มเติม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
            <div>
              <div className="w-11 h-11 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2" data-font="ui">ข้อมูลเจาะลึกที่แท้จริง</h3>
              <p className="text-muted text-sm leading-relaxed">
                เจาะลึกเรตติ้งด้านพี่เลี้ยง (Mentor) การเรียนรู้ (Learning) ปริมาณงาน (Workload) วัฒนธรรมองค์กร และเบี้ยเลี้ยงฝึกงานเฉลี่ยจริง
              </p>
            </div>
            <Link href="/search" className="text-sm font-semibold text-primary-ink hover:text-primary mt-4 flex items-center gap-1 w-fit" data-font="ui">
              <span>เริ่มค้นหา</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
            <div>
              <div className="w-11 h-11 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2" data-font="ui">คอมมูนิตี้แลกเปลี่ยน</h3>
              <p className="text-muted text-sm leading-relaxed">
                ช่องทางสำหรับคอมเมนต์และพูดคุยสอบถามข้อมูลเพิ่มเติมกับผู้รีวิวได้โดยตรง ช่วยไขทุกข้อสงสัยอย่างชัดเจน
              </p>
            </div>
            <Link href="/about" className="text-sm font-semibold text-primary-ink hover:text-primary mt-4 flex items-center gap-1 w-fit" data-font="ui">
              <span>วิธีการทำงาน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reviews Showcase */}
      <section className="bg-surface/20 border-t border-border/80 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider" data-font="ui">
                อัปเดตล่าสุด
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-2" data-font="ui">
                รีวิวฝึกงานล่าสุดจากรุ่นพี่
              </h2>
            </div>
            <Link 
              href="/search"
              className="text-sm font-semibold text-primary-ink bg-primary-light hover:bg-primary px-4 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm hover:shadow"
              data-font="ui"
            >
              <span>ดูรีวิวทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  currentUserId={user?.id} 
                  onCommentClick={(r) => setSelectedReview(r)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center">
              <Building2 className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-muted text-sm">ยังไม่มีรีวิวเข้ามาในขณะนี้ มาร่วมเป็นคนแรกที่เขียนรีวิวประสบการณ์กัน!</p>
            </div>
          )}
        </div>
      </section>

      {/* platform statistic */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold text-primary-ink" data-font="ui">100%</p>
            <p className="text-xs text-muted mt-1 font-medium">ปลอดภัย & Anonymous</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold text-primary-ink" data-font="ui">Free</p>
            <p className="text-xs text-muted mt-1 font-medium">ใช้งานฟรีสำหรับนักศึกษา</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold text-primary-ink" data-font="ui">Real</p>
            <p className="text-xs text-muted mt-1 font-medium">แชร์จากประสบการณ์จริง</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold text-primary-ink" data-font="ui">Active</p>
            <p className="text-xs text-muted mt-1 font-medium">คอมมูนิตี้อัปเดตตลอดเวลา</p>
          </div>
        </div>
      </section>

      {/* CTA Join Section */}
      <section className="bg-gradient-to-tr from-primary-light/40 to-accent/10 border-t border-border/80 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4" data-font="ui">
            ร่วมส่งต่อสังคมฝึกงานที่ดีและเป็นธรรมขึ้นด้วยกัน
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
            ทุกการแชร์และบอกเล่าในอดีตของคุณ มีค่าเป็นเกราะป้องกันและแสงนำทางให้แก่เพื่อนๆ และน้องๆ รุ่นถัดไปได้เจอกับโอกาสและสวัสดิการที่เหมาะสมที่สุด
          </p>
          <Link
            href={user ? "/review/new" : "/login"}
            className="bg-primary text-primary-ink px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-hover shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer inline-flex items-center gap-1.5"
            data-font="ui"
          >
            <PenLine className="w-4 h-4" />
            <span>{user ? "เขียนรีวิวประสบการณ์ของคุณ" : "เข้าสู่ระบบเพื่อรีวิวฝึกงาน"}</span>
          </Link>
        </div>
      </section>

      {/* Modal Review Details */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          currentUserId={user?.id}
        />
      )}
    </>
  );
}
