"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Building2, PenLine, ShieldCheck, ArrowRight } from "lucide-react";
import { ReviewModal } from "@/components/ReviewModal";
import { ShareCardModal } from "@/components/ShareCardModal";
import { ReviewCard, Review } from "@/components/ReviewCard";

type SortOption = "latest" | "rating" | "pay";


type Props = {
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
  dbReviews: Review[];
  initialSearch?: string;
};

export function ReviewFeed({ user, dbReviews, initialSearch = "" }: Props) {
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

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
  const [industry, setIndustry] = useState("ทั้งหมด");
  const [sort, setSort] = useState<SortOption>("latest");
  const [payMin, setPayMin] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [shareReview, setShareReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industry, sort, payMin]);


  // ค้นหาและรวบรวมประเภทธุรกิจ (Industry) ทั้งหมดจากข้อมูลจริงใน Database
  const industries = useMemo(() => {
    const unique = new Set(
      dbReviews
        .map((r) => r.company?.industry)
        .filter(Boolean)
    );
    return ["ทั้งหมด", ...Array.from(unique)];
  }, [dbReviews]);

  const filtered = useMemo(() => {
    let result = [...dbReviews];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.company.name.toLowerCase().includes(q) ||
          r.position.toLowerCase().includes(q) ||
          (r.user?.name || "").toLowerCase().includes(q)
      );
    }

    if (industry !== "ทั้งหมด") {
      result = result.filter((r) => r.company.industry === industry);
    }

    if (payMin) {
      const min = parseInt(payMin);
      if (!isNaN(min)) {
        result = result.filter((r) => r.pay && r.pay >= min);
      }
    }

    switch (sort) {
      case "rating":
        result.sort((a, b) => b.ratingOverall - a.ratingOverall);
        break;
      case "pay":
        result.sort((a, b) => (b.pay ?? 0) - (a.pay ?? 0));
        break;
      case "latest":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [dbReviews, search, industry, sort, payMin]);

  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-light/50 via-bg to-accent-pale/30 py-10 sm:py-12 relative overflow-hidden border-b border-border/50">
        {/* Background decorative glows */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2" data-font="ui">
            ค้นหารีวิวฝึกงาน
          </h1>
          <p className="text-muted text-xs sm:text-sm mb-6 max-w-md mx-auto">
            ค้นหาและคัดกรองประสบการณ์ฝึกงานจริงจากรุ่นพี่ในบริษัทและตำแหน่งต่างๆ
          </p>

          <div className="relative max-w-xl mx-auto">
            <input
              type="search"
              aria-label="ค้นหาบริษัทหรือตำแหน่งงาน"
              placeholder="ค้นหาบริษัท, ตำแหน่ง หรือสายงานที่สนใจ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl px-5 py-3 pl-12 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary shadow-md focus:shadow-lg transition-all duration-200 text-sm min-h-[44px]"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes feedFadeIn {
            from { opacity: 0.4; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-feed-fade {
            animation: feedFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />
      </section>

      <div className="sticky top-14 z-20 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto">
          {/* Row 1: Industry filter pills — horizontal scroll, no wrap */}
          <div className="px-4 pt-2.5 pb-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5 w-max min-w-full pb-2.5">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  aria-pressed={industry === ind}
                  className={`px-3.5 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[40px] flex items-center justify-center gap-1 shrink-0 shadow-md hover:shadow-lg active:scale-[0.98] ${
                    industry === ind
                      ? "bg-primary text-primary-ink font-medium shadow-md shadow-primary/20"
                      : "bg-surface text-muted hover:bg-surface-hover hover:text-ink"
                  }`}
                  data-font="ui"
                >
                  {ind === "ทั้งหมด" ? <><Building2 className="w-3.5 h-3.5" /> ทั้งหมด</> : ind}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Pay filter + Sort — compact row, full width on mobile */}
          <div className="px-4 py-2 flex items-center gap-2 border-t border-border/50">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="number"
                aria-label="ค่าเบี้ยเลี้ยงขั้นต่ำ"
                placeholder="เบี้ยเลี้ยงขั้นต่ำ (บาท)"
                value={payMin}
                onChange={(e) => setPayMin(e.target.value)}
                className="w-full bg-surface rounded-xl pl-8 pr-3 py-2 text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary shadow-md focus:shadow-lg transition-all duration-200 min-h-[40px]"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="จัดเรียงลำดับรีวิว"
                className="bg-surface rounded-xl pl-3 pr-8 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-primary shadow-md focus:shadow-lg transition-all duration-200 cursor-pointer appearance-none min-h-[40px] font-medium"
                data-font="ui"
              >
                <option value="latest">ล่าสุด</option>
                <option value="rating">คะแนนสูงสุด</option>
                <option value="pay">เบี้ยเลี้ยงมากสุด</option>
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
         {filtered.length > 0 ? (
          <>
            <div 
              key={`${search}-${industry}-${sort}-${payMin}-${currentPage}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-feed-fade"
            >
              {paginated.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  currentUserId={user?.id} 
                  onCommentClick={(r) => setSelectedReview(r)}
                  onShareClick={(r) => setShareReview(r)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10" data-font="ui">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-ink hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center bg-white"
                  aria-label="หน้าก่อนหน้า"
                >
                  ก่อนหน้า
                </button>
                
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 350, behavior: "smooth" });
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] ${
                          isActive
                            ? "bg-primary text-primary-ink font-bold ring-2 ring-primary/20 shadow-md shadow-primary/20"
                            : "border border-border text-ink hover:bg-slate-50 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-ink hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center bg-white"
                  aria-label="หน้าถัดไป"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-medium text-ink mb-2" data-font="ui">
              ยังไม่มีรีวิวที่ตรงกับการค้นหา
            </h2>
            <p className="text-muted mb-6">
              ลองเปลี่ยนคำค้นหา หรือเป็นคนแรกที่เขียนรีวิว!
            </p>
            <Link
              href={user ? "/review/new" : "/login"}
              className="inline-block bg-primary text-primary-ink px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors active:scale-[0.97] cursor-pointer"
              data-font="ui"
            >
              {user ? <><PenLine className="w-4 h-4 inline -mt-0.5" /> เขียนรีวิว</> : "เข้าสู่ระบบเพื่อเขียนรีวิว"}
            </Link>
          </div>
        )}
      </main>

      {/* About GIntern Section (เกี่ยวกับเว็บเรา) */}
      <section className="border-t border-border/80 bg-surface/20 py-16 w-full">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink" data-font="ui">
              เกี่ยวกับ GIntern
            </h2>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              เราคือคอมมูนิตี้ปลอดภัยของนักศึกษาและผู้แนะนำฝึกงาน จัดตั้งขึ้นเพื่อช่วยแบ่งปันข้อมูลและไขข้อข้องใจเกี่ยวกับการฝึกงานจริง เพื่อให้รุ่นน้องค้นหาที่ทำงานที่ใช่ได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: เด่นที่สุด - ปลอดภัยด้วย Anonymous (กว้าง 2 คอลัมน์บน Desktop) */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border md:col-span-2 flex flex-col justify-between transition-shadow duration-200 shadow-md hover:shadow-lg group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xl">
                  รุ่นพี่สามารถเลือกปิดบังหรือเปิดเผยตัวตนจริงในรีวิวได้ตามต้องการ พร้อมระบบ Anonymous Comment Guard ที่จะซ่อนตัวตนจริงของผู้เขียนในช่องคอมเมนต์โดยอัตโนมัติ เพื่อรักษาความเป็นส่วนตัวสูงสุดและสร้างความสบายใจให้กับทุกคนที่ต้องการแบ่งปันรีวิวตามจริง
                </p>
              </div>
              <span className="text-xs text-primary-ink/80 font-semibold mt-4 flex items-center gap-1.5" data-font="ui">
                <ShieldCheck className="w-4 h-4 text-primary-ink shrink-0" />
                <span>ปลอดภัย 100% ไร้กังวล</span>
              </span>
            </div>

            {/* Card 2: ขนาดปกติ */}
            <div className="bg-surface rounded-2xl p-6 border border-border md:col-span-1 flex flex-col justify-between transition-shadow duration-200 shadow-md hover:shadow-lg group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink mb-2" data-font="ui">ค้นหารีวิวแบบเจาะลึก</h3>
                <p className="text-muted text-sm leading-relaxed">
                  คัดกรองข้อมูลตามประเภทธุรกิจ, ชื่อบริษัท, สายงาน และเช็คระดับเบี้ยเลี้ยงฝึกงานเฉลี่ยจริงแบบเรียลไทม์ เพื่อช่วยตอบโจทย์ชีวิตฝึกงานที่ดีที่สุด
                </p>
              </div>
            </div>

            {/* Card 3: ขนาดปกติ */}
            <div className="bg-surface rounded-2xl p-6 border border-border md:col-span-1 flex flex-col justify-between transition-shadow duration-200 shadow-md hover:shadow-lg group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink mb-2" data-font="ui">พูดคุยไขข้อข้องใจ</h3>
                <p className="text-muted text-sm leading-relaxed">
                  รุ่นน้องสามารถพิมพ์คอมเมนต์สอบถามรายละเอียดเพิ่มเติมกับผู้รีวิวได้โดยตรงในแต่ละโพสต์ เพื่อไขความกระจ่างในรายละเอียดงาน วัฒนธรรม หรือเรื่องราวเชิงลึก
                </p>
              </div>
            </div>

            {/* Card 4: การ์ดเติมเต็มแบบยาว (Asymmetric Call-to-action) */}
            <div className="bg-gradient-to-tr from-primary-light/30 to-accent-pale rounded-2xl p-6 border border-primary-light/30 md:col-span-2 flex flex-col justify-between transition-shadow duration-200 shadow-md hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
                <div>
                  <h3 className="text-lg font-bold text-primary-ink mb-2" data-font="ui">
                    มาร่วมสร้างสังคมฝึกงานที่ดีขึ้นด้วยกัน
                  </h3>
                  <p className="text-muted text-sm max-w-lg leading-relaxed">
                    ทุกๆ รีวิวของคุณคือพลังสำคัญที่ช่วยให้น้องๆ รุ่นถัดไปได้เจอกับโอกาสและสภาพแวดล้อมการฝึกงานที่ตอบโจทย์ที่สุด
                  </p>
                </div>
                <Link
                  href={user ? "/review/new" : "/login"}
                  className="bg-primary text-primary-ink px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-hover shadow-md hover:shadow-lg transition-shadow duration-200 text-center w-full md:w-auto shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer"
                  data-font="ui"
                >
                  {user ? "เขียนรีวิวเลย" : "เข้าสู่ระบบเพื่อรีวิว"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          currentUserId={user?.id}
          onShareClick={(r) => {
            setSelectedReview(null);
            setShareReview(r as any);
          }}
        />
      )}
      {shareReview && (
        <ShareCardModal
          review={shareReview as any}
          onClose={() => setShareReview(null)}
        />
      )}
    </>
  );
}
