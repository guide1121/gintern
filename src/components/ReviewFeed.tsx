"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Building2, PenLine, ShieldCheck, ArrowRight, Coins, MessageSquare, Info, Shield, Heart, ChevronDown, Check, Clock, Star } from "lucide-react";
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
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industry, sort, payMin]);

  // Intersection Observer for About Section Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  // Click Outside to close Custom Sort Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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

          <div className="relative max-w-xl mx-auto group/search">
            <input
              type="search"
              aria-label="ค้นหาบริษัทหรือตำแหน่งงาน"
              placeholder="ค้นหาบริษัท, ตำแหน่ง หรือสายงานที่สนใจ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl px-5 py-3 pl-12 text-ink placeholder:text-muted outline-none border border-slate-200/60 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-md focus:shadow-lg transition-all duration-200 text-sm min-h-[44px]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-transform duration-200 group-focus-within/search:scale-110 group-focus-within/search:text-primary" />
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
                  className={`group px-3.5 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[40px] flex items-center justify-center gap-1 shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] border ${
                    industry === ind
                      ? "bg-primary text-primary-ink font-semibold border-primary/20 shadow-primary/10"
                      : "bg-white text-muted hover:bg-slate-50 hover:text-ink border-slate-200/50"
                  }`}
                  data-font="ui"
                >
                  {ind === "ทั้งหมด" ? (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-primary-ink/70 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" /> 
                      <span>ทั้งหมด</span>
                    </>
                  ) : (
                    ind
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Pay filter + Sort — compact row, full width on mobile */}
          <div className="px-4 py-2 flex items-center gap-2 border-t border-border/50">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none transition-colors">
                <Coins className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="number"
                aria-label="ค่าเบี้ยเลี้ยงขั้นต่ำ"
                placeholder="เบี้ยเลี้ยงขั้นต่ำ (บาท)"
                value={payMin}
                onChange={(e) => setPayMin(e.target.value)}
                className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-sm text-ink placeholder:text-muted outline-none border border-slate-200/50 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-sm focus:shadow-md transition-all duration-200 min-h-[40px]"
              />
            </div>

            {/* Custom Sort Select Dropdown */}
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                aria-label="จัดเรียงลำดับรีวิว"
                className="group flex items-center justify-between gap-2 bg-white rounded-xl px-3.5 py-2 text-sm text-ink outline-none border border-slate-200/50 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[40px] font-semibold"
                data-font="ui"
              >
                <div className="flex items-center gap-1.5 text-primary-ink">
                  {sort === "latest" && <Clock className="w-4 h-4 text-primary" />}
                  {sort === "rating" && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  {sort === "pay" && <Coins className="w-4 h-4 text-emerald-500" />}
                  
                  <span>
                    {sort === "latest" && "ล่าสุด"}
                    {sort === "rating" && "คะแนนสูงสุด"}
                    {sort === "pay" && "เบี้ยเลี้ยงมากสุด"}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-out ${
                  isSortOpen ? "rotate-180 text-primary" : "group-hover:text-slate-600"
                }`} />
              </button>

              {/* Dropdown Menu Options */}
              <div 
                role="listbox"
                className={`absolute right-0 mt-2 w-48 bg-white border border-slate-200/60 rounded-xl shadow-lg z-30 py-1 transition-all duration-200 origin-top-right ${
                  isSortOpen 
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                {[
                  { value: "latest", label: "ล่าสุด", icon: <Clock className="w-3.5 h-3.5" /> },
                  { value: "rating", label: "คะแนนสูงสุด", icon: <Star className="w-3.5 h-3.5" /> },
                  { value: "pay", label: "เบี้ยเลี้ยงมากสุด", icon: <Coins className="w-3.5 h-3.5" /> }
                ].map((opt) => {
                  const isSelected = sort === opt.value;
                  return (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSort(opt.value as SortOption);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                        isSelected 
                          ? "bg-primary-light/30 text-primary-ink font-semibold" 
                          : "text-ink hover:bg-slate-50"
                      }`}
                      data-font="ui"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-200 ${
                          isSelected ? "text-primary scale-110" : "text-slate-400"
                        }`}>
                          {opt.icon}
                        </span>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
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
      <section 
        ref={aboutRef}
        className={`border-t border-border/60 bg-surface/20 py-16 w-full transition-all duration-500 ${
          aboutVisible ? 'reveal-active' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 reveal-item delay-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink" data-font="ui">
              เกี่ยวกับ GIntern
            </h2>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              เราคือคอมมูนิตี้ปลอดภัยของนักศึกษาและผู้แนะนำฝึกงาน จัดตั้งขึ้นเพื่อช่วยแบ่งปันข้อมูลและไขข้อข้องใจเกี่ยวกับการฝึกงานจริง เพื่อให้รุ่นน้องค้นหาที่ทำงานที่ใช่ได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: เด่นที่สุด - ปลอดภัยด้วย Anonymous (กว้าง 2 คอลัมน์บน Desktop) */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 md:col-span-2 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary-light/60 transition-all duration-300 ease-out group reveal-item delay-200">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary-ink border border-primary-light/40 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-primary-light/35 transition-[transform,background-color] duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary-ink transition-colors" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xl">
                  รุ่นพี่สามารถเลือกปิดบังหรือเปิดเผยตัวตนจริงในรีวิวได้ตามต้องการ พร้อมระบบ Anonymous Comment Guard ที่จะซ่อนตัวตนจริงของผู้เขียนในช่องคอมเมนต์โดยอัตโนมัติ เพื่อรักษาความเป็นส่วนตัวสูงสุดและสร้างความสบายใจให้กับทุกคนที่ต้องการแบ่งปันรีวิวตามจริง
                </p>
              </div>
              <span className="text-xs text-primary-ink/80 font-semibold mt-5 flex items-center gap-1.5" data-font="ui">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>ปลอดภัย 100% ไร้กังวล</span>
              </span>
            </div>

            {/* Card 2: ขนาดปกติ */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/50 md:col-span-1 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-accent/40 transition-all duration-300 ease-out group reveal-item delay-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-pale/50 text-accent-ink border border-accent-pale/80 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-accent-pale transition-[transform,background-color] duration-300">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-accent-ink transition-colors" data-font="ui">ค้นหารีวิวแบบเจาะลึก</h3>
                <p className="text-muted text-sm leading-relaxed">
                  คัดกรองข้อมูลตามประเภทธุรกิจ, ชื่อบริษัท, สายงาน และเช็คระดับเบี้ยเลี้ยงฝึกงานเฉลี่ยจริงแบบเรียลไทม์ เพื่อช่วยตอบโจทย์ชีวิตฝึกงานที่ดีที่สุด
                </p>
              </div>
            </div>

            {/* Card 3: ขนาดปกติ */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/50 md:col-span-1 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary-light/40 transition-all duration-300 ease-out group reveal-item delay-400">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary-ink border border-primary-light/30 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-primary-light/30 transition-[transform,background-color] duration-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-primary-ink transition-colors" data-font="ui">พูดคุยไขข้อข้องใจ</h3>
                <p className="text-muted text-sm leading-relaxed">
                  รุ่นน้องสามารถพิมพ์คอมเมนต์สอบถามรายละเอียดเพิ่มเติมกับผู้รีวิวได้โดยตรงในแต่ละโพสต์ เพื่อไขความกระจ่างในรายละเอียดงาน วัฒนธรรม หรือเรื่องราวเชิงลึก
                </p>
              </div>
            </div>

            {/* Card 4: การ์ดเติมเต็มแบบยาว (Asymmetric Call-to-action) */}
            <div className="bg-gradient-to-br from-primary-light/20 via-bg to-accent-pale/25 rounded-2xl p-6 border border-primary-light/30 md:col-span-2 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 ease-out reveal-item delay-400">
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
                  className="group/btn bg-primary text-primary-ink px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center w-full md:w-auto shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95 gap-1.5"
                  data-font="ui"
                >
                  <PenLine className="w-4 h-4 transition-transform duration-200 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
                  <span>{user ? "เขียนรีวิวเลย" : "เข้าสู่ระบบเพื่อรีวิว"}</span>
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
