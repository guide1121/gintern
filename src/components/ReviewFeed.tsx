"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Coins, Heart, MessageCircle, Search, PenLine, Building2 } from "lucide-react";
import { ReviewModal } from "@/components/ReviewModal";
import { toggleLike } from "@/app/actions/review";

type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string | null;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
};

type Like = {
  id: string;
  userId: string;
  reviewId: string;
};

type Comment = {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  createdAt: Date;
};

type Review = {
  id: string;
  userId: string;
  companyId: string;
  position: string;
  experienceType: string;
  ratingOverall: number;
  ratingMentor: number;
  ratingLearning: number;
  ratingWorkload: number;
  ratingCulture: number;
  pay: number | null;
  payType: string | null;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  company: Company;
  likes: Like[];
  comments: Comment[];
  user?: User | null;
};

type SortOption = "latest" | "rating" | "pay";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="text-lg text-star tracking-wider" role="img" aria-label={`${rating} ดาว`}>
      {"★".repeat(full)}
      {half && "★"}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-primary-light/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-ink w-5 text-right font-medium" data-font="ui">
        {value}
      </span>
    </div>
  );
}

function ExperienceBadge({ type }: { type: string }) {
  if (type === "intern") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-ink" data-font="ui">
        <GraduationCap className="w-3.5 h-3.5" /> Intern
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/30 border border-primary-light/50 text-accent-ink" data-font="ui">
      <Briefcase className="w-3.5 h-3.5" /> พนักงาน
    </span>
  );
}

function ReviewCard({ 
  review, 
  currentUserId,
  onCommentClick 
}: { 
  review: Review; 
  currentUserId?: string | null;
  onCommentClick?: (review: Review) => void;
}) {
  const [liked, setLiked] = useState(
    currentUserId ? review.likes.some((l) => l.userId === currentUserId) : false
  );
  const [likesCount, setLikesCount] = useState(review.likes.length);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLiked(currentUserId ? review.likes.some((l) => l.userId === currentUserId) : false);
    setLikesCount(review.likes.length);
  }, [review.likes, currentUserId]);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) {
      showError("กรุณาเข้าสู่ระบบเพื่อกดถูกใจ");
      return;
    }
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    const result = await toggleLike(review.id);
    if (result.error) {
      setLiked(liked);
      setLikesCount(likesCount);
      showError(result.error);
    }
  };

  const displayImage = review.isAnonymous ? null : review.user?.image;
  const displayName = review.isAnonymous ? "รุ่นพี่ไม่ระบุตัวตน" : (review.user?.name || "ผู้ใช้งาน");
  const initials = review.isAnonymous ? "พี่" : (review.user?.name || "?").charAt(0).toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <article 
      onClick={() => onCommentClick && onCommentClick(review)}
      className="bg-surface rounded-2xl p-5 transition-transform duration-200 ease-out hover:scale-[1.005] cursor-pointer relative"
    >
      {/* Inline error toast */}
      {errorMsg && (
        <div
          className="absolute inset-x-4 -top-2 z-10 bg-rose-600 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg flex items-center gap-2"
          role="alert"
          aria-live="assertive"
          data-font="ui"
        >
          <span className="shrink-0">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100 ring-2 ring-primary-light/50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-light text-primary-ink flex items-center justify-center text-sm font-medium shrink-0 select-none" data-font="ui">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-ink" data-font="ui">{displayName}</span>
            <ExperienceBadge type={review.experienceType} />
          </div>
          <p className="text-sm text-muted truncate">
            {review.company.name} · {review.position}
          </p>
        </div>
        <span className="text-xs text-muted shrink-0 pt-1">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Stars rating={review.ratingOverall} />
        <span className="text-ink font-medium" data-font="ui">{review.ratingOverall}</span>
      </div>

      <p className="text-ink leading-[1.7] mb-4 text-sm" style={{ textWrap: "pretty" }}>
        {review.content}
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
        <RatingBar label="พี่เลี้ยง" value={review.ratingMentor} />
        <RatingBar label="การเรียนรู้" value={review.ratingLearning} />
        <RatingBar label="ปริมาณงาน" value={review.ratingWorkload} />
        <RatingBar label="วัฒนธรรม" value={review.ratingCulture} />
      </div>

      {review.pay && (
        <div className="flex items-center gap-1.5 text-sm text-accent-ink bg-primary-light/20 border border-primary-light/50 px-3 py-1.5 rounded-full w-fit mb-4">
          <Coins className="w-4 h-4 text-accent" />
          <span data-font="ui">
            {review.pay.toLocaleString()} {review.payType || "บาท/เดือน"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-5 pt-3 border-t border-border">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer ${
            liked ? "text-rose-500 font-semibold" : "text-muted hover:text-rose-500"
          }`}
          aria-label={liked ? "เอาถูกใจออก" : "ถูกใจ"}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span data-font="ui">{likesCount}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onCommentClick) onCommentClick(review);
          }}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
          aria-label="คอมเมนต์"
        >
          <MessageCircle className="w-4 h-4" />
          <span data-font="ui">{review.comments?.length || 0}</span>
        </button>
      </div>
    </article>
  );
}

type Props = {
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
  dbReviews: Review[];
};

export function ReviewFeed({ user, dbReviews }: Props) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("ทั้งหมด");
  const [sort, setSort] = useState<SortOption>("latest");
  const [payMin, setPayMin] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industry, sort, payMin]);

  const words = ["Get", "Good", "Go"];
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
      <section className="bg-primary-light py-16 sm:py-20 relative overflow-hidden">

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          {/* Animated GIntern Wordplay Header */}
          <h1
            className="text-4xl sm:text-6xl font-bold text-ink mb-6 flex items-center justify-center select-none text-center"
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
            className="text-xl sm:text-2xl font-medium text-ink/80 mb-3"
            style={{ textWrap: "balance" }}
          >
            รีวิวฝึกงานจากรุ่นพี่ตัวจริง
          </h2>
          <p className="text-muted text-sm sm:text-base mb-6 max-w-lg mx-auto leading-relaxed">
            ค้นหาประสบการณ์จริงจากคนที่เคยผ่านมา
            <br className="sm:hidden" />
            ไม่ fake ไม่ผ่านบริษัท
          </p>

          {user && (
            <div className="mb-8 flex justify-center">
              <Link
                href="/review/new"
                className="inline-flex items-center gap-2 bg-primary text-primary-ink px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
                data-font="ui"
              >
                <PenLine className="w-4 h-4" />
                <span>เขียนรีวิวประสบการณ์</span>
              </Link>
            </div>
          )}

          <div className="relative max-w-xl mx-auto">
            <input
              type="search"
              aria-label="ค้นหาบริษัทหรือตำแหน่งงาน"
              placeholder="ค้นหาบริษัท, ตำแหน่ง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl px-5 py-3.5 pl-12 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow duration-150 text-base min-h-[44px]"
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
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cursor-blink {
            animation: cursorBlink 0.8s step-end infinite;
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
                  className={`px-3.5 py-2 rounded-full text-sm whitespace-nowrap transition-colors duration-150 cursor-pointer min-h-[40px] flex items-center justify-center gap-1 shrink-0 ${
                    industry === ind
                      ? "bg-primary text-primary-ink font-medium"
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
                className="w-full bg-surface rounded-xl pl-8 pr-3 py-2 text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary transition-shadow duration-150 min-h-[40px]"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="จัดเรียงลำดับรีวิว"
                className="bg-surface rounded-xl pl-3 pr-8 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none min-h-[40px] font-medium"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginated.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  currentUserId={user?.id} 
                  onCommentClick={(r) => setSelectedReview(r)}
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
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-ink hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] flex items-center"
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
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-ink font-bold ring-2 ring-primary/20"
                            : "border border-border text-ink hover:bg-slate-50 hover:border-slate-300"
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
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-ink hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] flex items-center"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-border transition-colors hover:bg-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-ink mb-2" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                รุ่นพี่สามารถเลือกปิดบังหรือเปิดเผยตัวตนจริงในรีวิวได้ตามต้องการ พร้อมระบบ Anonymous Comment Guard ที่จะซ่อนตัวตนจริงของผู้เขียนในช่องคอมเมนต์โดยอัตโนมัติ
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border transition-colors hover:bg-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-ink mb-2" data-font="ui">ค้นหารีวิวแบบเจาะลึก</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                คัดกรองข้อมูลตามประเภทธุรกิจ, ชื่อบริษัท, สายงาน และเช็คระดับเบี้ยเลี้ยงฝึกงานเฉลี่ยจริงแบบเรียลไทม์ เพื่อช่วยตอบโจทย์ชีวิตฝึกงานที่ดีที่สุด
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border transition-colors hover:bg-surface-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-ink mb-2" data-font="ui">พูดคุยไขข้อข้องใจ</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                รุ่นน้องสามารถพิมพ์คอมเมนต์สอบถามรายละเอียดเพิ่มเติมกับผู้รีวิวได้โดยตรงในแต่ละโพสต์ เพื่อไขความกระจ่างในรายละเอียดงาน วัฒนธรรม หรือเรื่องราวเชิงลึก
              </p>
            </div>
          </div>
        </div>
      </section>

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
