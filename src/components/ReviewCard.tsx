"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Coins, Heart, MessageCircle, AlertTriangle, Share2, PenLine, Trash2, Star } from "lucide-react";
import { toggleLike } from "@/app/actions/review";

export type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string | null;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
};

export type User = {
  id: string;
  name: string;
  email?: string | null;
  image: string | null;
  role: string | null;
  badges?: Badge[];
  showBadges?: boolean;
};

export type Like = {
  id: string;
  userId: string;
  reviewId: string;
};

export type Comment = {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  createdAt: Date;
};

export type Review = {
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

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" role="img" aria-label={`${rating} จาก 5 คะแนน`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const diff = rating - (star - 1);
        let fillPct = 0;
        if (diff >= 1) fillPct = 100;
        else if (diff > 0) fillPct = Math.round(diff * 100);

        return (
          <div key={star} className="relative w-4 h-4 shrink-0">
            {/* Gray star underlay */}
            <Star className="absolute inset-0 w-full h-full text-slate-200" />
            {/* Colored star overlay based on fill percentage */}
            {fillPct > 0 && (
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: `${fillPct}%` }}
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 max-w-none" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  
  // Dynamic color coding based on rating value for better visual context
  let barColor = "bg-rose-500";
  if (value >= 4.5) barColor = "bg-emerald-500";
  else if (value >= 3.5) barColor = "bg-primary";
  else if (value >= 2.0) barColor = "bg-amber-500";

  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted w-16 sm:w-20 shrink-0 font-medium">{label}</span>
      <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-ink w-5 text-right font-semibold" data-font="ui">
        {value}
      </span>
    </div>
  );
}

export function ExperienceBadge({ type }: { type: string }) {
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

type ReviewCardProps = {
  review: Review;
  currentUserId?: string | null;
  onCommentClick?: (review: Review) => void;
  onShareClick?: (review: Review) => void;
  onEditClick?: (review: Review) => void;
  onDeleteClick?: (review: Review) => void;
  isDeleting?: boolean;
};

export function ReviewCard({
  review,
  currentUserId,
  onCommentClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  isDeleting = false,
}: ReviewCardProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(review);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditClick) {
      onEditClick(review);
    }
  };

  const displayImage = review.isAnonymous ? null : review.user?.image;
  const displayName = review.isAnonymous ? "รุ่นพี่ไม่ระบุตัวตน" : (review.user?.name || "ผู้ใช้งาน");
  const initials = review.isAnonymous ? "พี่" : (review.user?.name || "?").charAt(0).toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      onClick={() => onCommentClick && onCommentClick(review)}
      className="group/card bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary-light/60 transition-all duration-300 ease-out cursor-pointer relative border border-slate-200/50 h-full flex flex-col justify-between"
    >
      {/* Inline error toast */}
      {errorMsg && (
        <div
          className="absolute inset-x-4 -top-2 z-10 bg-rose-600 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg flex items-center gap-2"
          role="alert"
          aria-live="assertive"
          data-font="ui"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
        {!review.isAnonymous && review.user?.id ? (
          <Link
            href={`/profile/${review.user.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-slate-100 ring-2 ring-primary-light/50 hover:opacity-85 transition-opacity"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary-ink flex items-center justify-center text-sm font-medium select-none hover:bg-primary-light/80 transition-colors" data-font="ui">
                {initials}
              </div>
            )}
          </Link>
        ) : (
          displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100 ring-2 ring-primary-light/50"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 flex items-center justify-center text-sm font-semibold shrink-0 select-none" data-font="ui">
              {initials}
            </div>
          )
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {!review.isAnonymous && review.user?.id ? (
              <Link
                href={`/profile/${review.user.id}`}
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-ink hover:text-primary hover:underline transition-colors"
                data-font="ui"
              >
                {displayName}
              </Link>
            ) : (
              <span className="font-medium text-ink" data-font="ui">{displayName}</span>
            )}
            {!review.isAnonymous && review.user?.showBadges !== false && review.user?.badges?.map((badge) => (
              <span
                key={badge.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-pale text-accent-ink border border-accent/20 shadow-sm"
                title={badge.description || ""}
                aria-label={`ตราสัญลักษณ์: ${badge.name}`}
                data-font="ui"
              >
                <span role="img" aria-hidden="true" className="mr-0.5">✨</span>
                {badge.name}
              </span>
            ))}
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

      <p className="text-ink leading-[1.7] mb-4 text-sm line-clamp-3" style={{ textWrap: "pretty" }}>
        {review.content}
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
        <RatingBar label="พี่เลี้ยง" value={review.ratingMentor} />
        <RatingBar label="การเรียนรู้" value={review.ratingLearning} />
        <RatingBar label="ปริมาณงาน" value={review.ratingWorkload} />
        <RatingBar label="วัฒนธรรม" value={review.ratingCulture} />
      </div>

      {review.pay !== null ? (
        review.pay > 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-accent-ink bg-primary-light/20 border border-primary-light/50 px-3 py-1.5 rounded-full w-fit mb-4 shadow-sm">
            <Coins className="w-4 h-4 text-accent" />
            <span data-font="ui">
              {review.pay.toLocaleString()} {review.payType || "บาท/เดือน"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-rose-600 bg-rose-50/50 border border-rose-100 px-3 py-1.5 rounded-full w-fit mb-4 shadow-sm">
            <Coins className="w-4 h-4 text-rose-400" />
            <span data-font="ui">ไม่มีเบี้ยเลี้ยง</span>
          </div>
        )
      ) : (
        <div className="flex items-center gap-1.5 text-sm text-slate-400 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-full w-fit mb-4 shadow-sm">
          <Coins className="w-4 h-4 text-slate-300" />
          <span data-font="ui">ไม่ระบุเบี้ยเลี้ยง</span>
        </div>
      )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLikeClick}
          className={`group/btn flex items-center gap-1.5 text-sm transition-colors duration-200 cursor-pointer min-h-[44px] ${
            liked ? "text-rose-500 font-semibold" : "text-muted hover:text-rose-500"
          }`}
          aria-label={liked ? "เอาถูกใจออก" : "ถูกใจ"}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110 group-active/btn:scale-95 ${liked ? "fill-current animate-heart-glow" : ""}`} />
          <span data-font="ui">{likesCount}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onCommentClick) onCommentClick(review);
          }}
          className="group/btn flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors duration-200 cursor-pointer min-h-[44px]"
          aria-label="คอมเมนต์"
        >
          <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110 group-active/btn:scale-95" />
          <span data-font="ui">{review.comments?.length || 0}</span>
        </button>

        {/* ปุ่มแก้ไขและลบ (หากเป็นของตนเอง) */}
        {onEditClick && onDeleteClick && (
          <div className="w-full md:w-auto md:ml-auto flex items-center gap-2 mt-1 md:mt-0 border-t border-dashed border-border/60 pt-3 md:pt-0 md:border-t-0">
            <button
              onClick={handleEdit}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary-light/40 hover:bg-primary-light/60 text-primary-ink shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[44px] active:scale-95"
              data-font="ui"
            >
              <PenLine className="w-4 h-4" />
              <span>แก้ไข</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-rose-50 hover:bg-rose-100/80 text-rose-600 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[44px] disabled:opacity-50 disabled:transform-none disabled:shadow-none active:scale-95"
              data-font="ui"
              aria-label="ลบรีวิว"
            >
              {isDeleting ? (
                <span className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>ลบ</span>
            </button>
          </div>
        )}

        {/* ปุ่มแชร์การ์ด */}
        {onShareClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareClick(review);
            }}
            className={`group/btn flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors duration-200 cursor-pointer min-h-[44px] ${
              onEditClick && onDeleteClick ? "" : "ml-auto"
            }`}
            aria-label="แชร์การ์ดรูปภาพ"
          >
            <Share2 className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
            <span className="hidden sm:inline text-xs font-semibold" data-font="ui">แชร์การ์ด</span>
          </button>
        )}
      </div>
    </article>
  );
}
