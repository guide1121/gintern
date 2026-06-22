"use client";

import { useState, useEffect, useRef } from "react";
import { X, Heart, MessageCircle, Coins, GraduationCap, Briefcase, Send, Sparkles } from "lucide-react";
import { toggleLike, addComment } from "@/app/actions/review";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  image: string | null;
};

type Comment = {
  id: string;
  userId: string;
  reviewId: string;
  content: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

type Like = {
  id: string;
  userId: string;
  reviewId: string;
};

type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string | null;
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
  user?: {
    id: string;
    name: string;
    image: string | null;
    role: string | null;
  } | null;
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="text-base text-star tracking-wider">
      {"★".repeat(full)}
      {half && "★"}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-primary-light/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-ink w-4 text-right font-medium" data-font="ui">
        {value}
      </span>
    </div>
  );
}

type Props = {
  review: Review;
  onClose: () => void;
  currentUserId?: string | null;
};

export function ReviewModal({ review, onClose, currentUserId }: Props) {
  const [liked, setLiked] = useState(
    currentUserId ? review.likes.some((l) => l.userId === currentUserId) : false
  );
  const [likesCount, setLikesCount] = useState(review.likes.length);
  const [comments, setComments] = useState<Comment[]>(review.comments);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // ป้องกันการสกรอลล์พื้นหลัง
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // เลื่อนลงล่างสุดเมื่อมีคอมเมนต์ใหม่
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleLike = async () => {
    if (!currentUserId) {
      alert("กรุณาเข้าสู่ระบบเพื่อกดถูกใจ");
      return;
    }
    // Optimistic Update
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    const result = await toggleLike(review.id);
    if (result.error) {
      // Rollback หากล้มเหลว
      setLiked(liked);
      setLikesCount(likesCount);
      alert(result.error);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("กรุณาเข้าสู่ระบบเพื่อเขียนความคิดเห็น");
      return;
    }
    const trimmed = newComment.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const result = await addComment(review.id, trimmed);
    setSending(false);

    if (result.error) {
      alert(result.error);
    } else if (result.comment) {
      setComments((prev) => [...prev, result.comment]);
      setNewComment("");
    }
  };

  // ข้อมูลผู้เขียนรีวิว
  const displayImage = review.isAnonymous ? null : review.user?.image;
  const displayName = review.isAnonymous ? "รุ่นพี่ไม่ระบุตัวตน" : (review.user?.name || "ผู้ใช้งาน");
  const initials = review.isAnonymous ? "พี่" : (review.user?.name || "?").charAt(0).toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in">
      {/* Backdrop Area to click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Box */}
      <div className="bg-white rounded-none sm:rounded-2xl w-full max-w-4xl h-full sm:h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative z-10 animate-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-ink hover:bg-surface-hover p-1.5 rounded-full transition-colors z-20 cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. คอลัมน์ซ้าย: เนื้อหารีวิว */}
        <div className="w-full md:w-3/5 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-border/80 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header: User Profile */}
            <div className="flex items-center gap-3">
              {!review.isAnonymous && review.user?.id ? (
                <Link
                  href={`/profile/${review.user.id}`}
                  onClick={onClose}
                  className="shrink-0"
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayName}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-light hover:opacity-85 transition-opacity"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-sm font-medium text-primary-ink select-none hover:bg-primary-light/80 transition-colors"
                      data-font="ui"
                    >
                      {initials}
                    </div>
                  )}
                </Link>
              ) : (
                displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-primary-light"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-sm font-medium text-primary-ink shrink-0 select-none"
                    data-font="ui"
                  >
                    {initials}
                  </div>
                )
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {!review.isAnonymous && review.user?.id ? (
                    <Link
                      href={`/profile/${review.user.id}`}
                      onClick={onClose}
                      className="font-semibold text-ink text-sm sm:text-base hover:text-primary hover:underline transition-colors"
                      data-font="ui"
                    >
                      {displayName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-ink text-sm sm:text-base" data-font="ui">
                      {displayName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-light text-primary-ink" data-font="ui">
                    {review.experienceType === "intern" ? (
                      <><GraduationCap className="w-3 h-3" /> Intern</>
                    ) : (
                      <><Briefcase className="w-3 h-3" /> พนักงาน</>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{formattedDate}</p>
              </div>
            </div>

            {/* Company & Position */}
            <div className="bg-surface/50 rounded-xl p-4 border border-border/30 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-lg font-bold text-ink mb-1" data-font="ui">
                {review.company.name}
              </h2>
              <p className="text-sm text-muted">ตำแหน่ง: {review.position} · {review.company.industry}</p>
            </div>

            {/* Ratings summary */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 py-2 border-b border-t border-border/40">
              <RatingBar label="พี่เลี้ยง" value={review.ratingMentor} />
              <RatingBar label="การเรียนรู้" value={review.ratingLearning} />
              <RatingBar label="ปริมาณงาน" value={review.ratingWorkload} />
              <RatingBar label="วัฒนธรรม" value={review.ratingCulture} />
            </div>

            {/* Review Content */}
            <div className="prose prose-sm max-w-none pt-1">
              <div className="flex items-center gap-2 text-sm mb-3">
                <Stars rating={review.ratingOverall} />
                <span className="text-ink font-bold" data-font="ui">
                  {review.ratingOverall.toFixed(1)}
                </span>
                <span className="text-muted text-xs font-normal">คะแนนเฉลี่ย</span>
              </div>
              <p className="text-ink leading-relaxed text-sm whitespace-pre-wrap" style={{ textWrap: "pretty" }}>
                {review.content}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            {/* Pay check */}
            {review.pay && (
              <div className="flex items-center gap-1.5 text-xs text-accent-ink bg-primary-light/20 border border-primary-light/50 px-3 py-1.5 rounded-full w-fit mb-4 shadow-md">
                <Coins className="w-4 h-4 text-accent" />
                <span data-font="ui">
                  เบี้ยเลี้ยง: {review.pay.toLocaleString()} {review.payType || "บาท/เดือน"}
                </span>
              </div>
            )}

            {/* Like and Comment buttons */}
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer ${
                  liked ? "text-rose-500 font-medium" : "text-muted hover:text-rose-500"
                }`}
                aria-label={liked ? "เอาถูกใจออก" : "ถูกใจ"}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span data-font="ui">{likesCount} ถูกใจ</span>
              </button>
              <span className="flex items-center gap-1.5 text-sm text-muted" data-font="ui">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} ความคิดเห็น</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. คอลัมน์ขวา: คอมเมนต์ */}
        <div className="w-full md:w-2/5 flex flex-col h-full bg-surface/30">
          {/* Header */}
          <div className="px-4 py-4 border-b border-border/80 bg-white" data-font="ui">
            <h3 className="text-sm font-semibold text-ink">ความคิดเห็น ({comments.length})</h3>
          </div>

          {/* List of comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const isPostAuthor = comment.userId === review.userId;
                const shouldHideIdentity = isPostAuthor && review.isAnonymous;

                const commenterName = shouldHideIdentity
                  ? "รุ่นพี่ไม่ระบุตัวตน"
                  : (comment.user?.name || "ผู้ใช้งาน");

                const commenterImage = shouldHideIdentity
                  ? null
                  : comment.user?.image;

                const commentInitials = shouldHideIdentity
                  ? "พี่"
                  : commenterName.charAt(0).toUpperCase();

                return (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    {commenterImage ? (
                      <img
                        src={commenterImage}
                        alt={commenterName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-muted flex items-center justify-center text-xs font-semibold shrink-0 select-none" data-font="ui">
                        {commentInitials}
                      </div>
                    )}
                    <div className="flex-1 bg-white rounded-2xl px-3.5 py-2.5 border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-semibold text-ink truncate block max-w-[120px]" data-font="ui">
                            {commenterName}
                          </span>
                          {isPostAuthor && (
                            <span className="shrink-0 bg-primary-light text-primary-ink text-[10px] font-semibold px-1.5 py-0.5 rounded-full select-none" data-font="ui">
                              ผู้เขียน
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-ink/90 mt-1 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-muted text-xs">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                ยังไม่มีความคิดเห็น เขียนคนแรกเลย!
              </div>
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendComment} className="p-3 bg-white border-t border-border/80 flex items-center gap-2">
            <input
              type="text"
              aria-label="เขียนความคิดเห็น"
              placeholder={currentUserId ? "เขียนความคิดเห็น..." : "เข้าสู่ระบบเพื่อแสดงความเห็น..."}
              disabled={!currentUserId || sending}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-surface rounded-xl px-4 py-2.5 text-xs text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[40px] disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!currentUserId || !newComment.trim() || sending}
              className="bg-primary text-primary-ink font-semibold p-2.5 rounded-xl hover:bg-primary-hover active:scale-95 shadow-md hover:shadow-lg transition-shadow duration-200 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
              aria-label="ส่งความคิดเห็น"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
