"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Coins, 
  Heart, 
  MessageCircle, 
  FileText, 
  PenLine, 
  Edit3, 
  Calendar,
  ThumbsUp,
  ShieldAlert,
  Trash2
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import Link from "next/link";
import { ReviewModal } from "@/components/ReviewModal";
import { deleteReview } from "@/app/actions/review";
import { ReviewCard, Review } from "@/components/ReviewCard";
import { ShareCardModal } from "@/components/ShareCardModal";

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
  workPlace: string | null;
  studyPlace: string | null;
  fieldOfStudy: string | null;
  bio: string | null;
  createdAt: Date;
  role: string | null;
  instagram?: string | null;
  facebook?: string | null;
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
  user?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

type DbReview = {
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

type DbLikeWithReview = {
  id: string;
  userId: string;
  reviewId: string;
  review: DbReview & {
    user: User;
  };
};

type Props = {
  dbUser: User & {
    reviews: DbReview[];
    likes: DbLikeWithReview[];
  };
};



export function ProfileContent({ dbUser }: Props) {
  const [activeTab, setActiveTab] = useState<"reviews" | "likes">("reviews");
  const [selectedReview, setSelectedReview] = useState<DbReview | null>(null);
  const [shareReview, setShareReview] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initials = (dbUser.name || "?").charAt(0).toUpperCase();
  const joinDate = new Date(dbUser.createdAt).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric"
  });

  // คำนวณไลก์ทั้งหมดที่ได้รับ
  const totalLikesReceived = dbUser.reviews.reduce((sum, r) => sum + r.likes.length, 0);

  // ตรวจสอบว่ามีข้อมูลเพื่อโชว์ Tag หรือไม่
  const hasTags = !!(dbUser.studyPlace || dbUser.workPlace || dbUser.fieldOfStudy);

  // คำนวณเปอร์เซ็นต์ความครบถ้วนของข้อมูลโปรไฟล์
  const completenessScore = useMemo(() => {
    let score = 0;
    if (dbUser.name) score += 15;
    if (dbUser.role) score += 15;
    if (dbUser.image) score += 15;
    if (dbUser.bio) score += 20;
    if (dbUser.studyPlace) score += 15;
    if (dbUser.workPlace) score += 10;
    if (dbUser.fieldOfStudy) score += 10;
    return score;
  }, [dbUser]);

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Social Media Profile Wrapper */}
      <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow duration-200">
        {/* Cover Banner */}
        <div className="w-full h-40 sm:h-48 bg-gradient-to-r from-[#7FC1E8] via-[#BFE2F5] to-[#7DD0B8] relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="absolute -bottom-8 left-1/4 w-32 h-32 rounded-full bg-white/5" />
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6">
          {/* Avatar and Edit Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Avatar */}
            {dbUser.image ? (
              <img
                src={dbUser.image}
                alt={dbUser.name}
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white bg-white ring-2 ring-primary-light shadow-sm relative z-10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary-light text-primary-ink flex items-center justify-center text-3xl font-medium border-4 border-white ring-2 ring-primary-light shadow-sm select-none relative z-10"
                data-font="ui"
              >
                {initials}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:translate-y-4 flex-wrap">
              <Link
                href="/review/new"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-ink px-4.5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-md min-h-[44px]"
                data-font="ui"
              >
                <PenLine className="w-4 h-4" />
                <span>เขียนรีวิว</span>
              </Link>
              <Link
                href="/profile/edit"
                className="flex items-center justify-center gap-2 border border-border hover:border-primary-light hover:bg-primary-light/10 text-ink px-4.5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white min-h-[44px]"
                data-font="ui"
              >
                <Edit3 className="w-4 h-4" />
                <span>แก้ไขโปรไฟล์</span>
              </Link>
            </div>
          </div>

          {/* User Meta Data */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-medium text-ink" data-font="ui">
                  {dbUser.name}
                </h1>
                {dbUser.role && (
                  dbUser.role === "admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200" data-font="ui">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      ผู้ดูแลระบบ
                    </span>
                  ) : dbUser.role === "recommender" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" data-font="ui">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      ผู้แนะนำ
                    </span>
                  ) : dbUser.role === "reader" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200" data-font="ui">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      ผู้อ่าน
                    </span>
                  ) : null
                )}
              </div>
              <p className="text-sm text-muted mt-0.5">{dbUser.email}</p>
            </div>

            {/* Bio */}
            {dbUser.bio && (
              <p className="text-sm text-ink max-w-xl leading-relaxed mt-2" style={{ textWrap: "pretty" }}>
                {dbUser.bio}
              </p>
            )}

            {/* Social Media Info */}
            {(dbUser.instagram || dbUser.facebook) && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5 select-none">
                {dbUser.instagram && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium shadow-sm"
                    data-font="ui"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{dbUser.instagram}</span>
                  </div>
                )}
                {dbUser.facebook && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 font-medium shadow-sm"
                    data-font="ui"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{dbUser.facebook}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags (Only show when data exists in DB) */}
            {hasTags && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {dbUser.studyPlace && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light/20 border border-primary-light/40 text-xs text-primary-ink font-medium" data-font="ui">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>เรียนที่ {dbUser.studyPlace}</span>
                  </span>
                )}
                {dbUser.workPlace && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-xs text-accent-ink font-medium" data-font="ui">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>ทำงานที่ {dbUser.workPlace}</span>
                  </span>
                )}
                {dbUser.fieldOfStudy && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-emerald-800 font-medium" data-font="ui">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>สายการเรียน {dbUser.fieldOfStudy}</span>
                  </span>
                )}
              </div>
            )}

            {/* Member since & Stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3 text-xs text-muted border-t border-border mt-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>เป็นสมาชิกเมื่อ {joinDate}</span>
              </span>

              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-ink">
                  <span className="text-lg font-bold text-primary mr-1" data-font="ui">{dbUser.reviews.length}</span>
                  <span className="text-muted text-xs font-normal">รีวิวที่เขียน</span>
                </span>
                <span className="text-ink">
                  <span className="text-lg font-bold text-accent mr-1" data-font="ui">{totalLikesReceived}</span>
                  <span className="text-muted text-xs font-normal">ไลก์ได้รับ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness Card */}
      {completenessScore < 100 && (
        <div className="mt-6 bg-gradient-to-r from-primary-light/30 via-accent/5 to-primary-light/20 border border-primary-light/40 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink" data-font="ui">
                  ความครบถ้วนของโปรไฟล์
                </span>
                <span className="text-sm font-semibold text-primary" data-font="ui">
                  {completenessScore}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
              <p className="text-xs text-muted">
                กรอกข้อมูลโปรไฟล์ให้ครบถ้วนเพื่อเพิ่มความน่าเชื่อถือและช่วยกระตุ้นการตัดสินใจให้กับรุ่นน้อง!
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-ink px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer whitespace-nowrap self-start sm:self-center"
              data-font="ui"
            >
              <PenLine className="w-4 h-4" />
              <span>กรอกข้อมูลโปรไฟล์</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="mt-8 border-b border-border flex gap-6">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
            activeTab === "reviews" ? "text-primary font-semibold" : "text-muted hover:text-ink"
          }`}
          data-font="ui"
        >
          รีวิวของฉัน ({dbUser.reviews.length})
          {activeTab === "reviews" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
            activeTab === "likes" ? "text-primary font-semibold" : "text-muted hover:text-ink"
          }`}
          data-font="ui"
        >
          ถูกใจแล้ว ({dbUser.likes.length})
          {activeTab === "likes" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Feed Content */}
      <div className="mt-6">
        {activeTab === "reviews" ? (
          dbUser.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dbUser.reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={{ ...review, user: dbUser } as any} 
                  currentUserId={dbUser.id} 
                  onCommentClick={(r) => setSelectedReview(r as any)}
                  onShareClick={(r) => setShareReview(r as any)}
                  onEditClick={(r) => {
                    window.location.href = `/review/new?editId=${r.id}`;
                  }}
                  onDeleteClick={async (r) => {
                    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้")) {
                      return;
                    }
                    setDeletingId(r.id);
                    const result = await deleteReview(r.id);
                    setDeletingId(null);
                    if (result.error) {
                      alert(result.error);
                    }
                  }}
                  isDeleting={deletingId === review.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-2xl border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
              <h3 className="text-base font-medium text-ink mb-1" data-font="ui">ยังไม่มีรีวิวของคุณ</h3>
              <p className="text-muted text-sm mb-5">มาร่วมแบ่งปันประสบการณ์การฝึกงานหรือการทำงานเพื่อประโยชน์ต่อรุ่นน้องตัวจริงกันนะ</p>
              <Link
                href="/review/new"
                className="inline-block bg-primary text-primary-ink px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                data-font="ui"
              >
                เขียนรีวิวแรก
              </Link>
            </div>
          )
        ) : (
          dbUser.likes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dbUser.likes.map((like) => (
                <ReviewCard 
                  key={like.id} 
                  review={like.review as any} 
                  currentUserId={dbUser.id} 
                  onCommentClick={(r) => setSelectedReview(r as any)}
                  onShareClick={(r) => setShareReview(r as any)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-2xl border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <ThumbsUp className="w-10 h-10 text-muted mx-auto mb-3" />
              <h3 className="text-base font-medium text-ink mb-1" data-font="ui">ยังไม่มีรีวิวที่ถูกใจ</h3>
              <p className="text-muted text-sm mb-5">เมื่อคุณพบรีวิวที่เป็นประโยชน์ สามารถกดไอคอนรูปหัวใจเพื่อเก็บประวัติไว้ที่นี่ได้</p>
              <Link
                href="/"
                className="inline-block bg-primary text-primary-ink px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                data-font="ui"
              >
                สำรวจรีวิวเลย
              </Link>
            </div>
          )
        )}
      </div>

      {selectedReview && (
        <ReviewModal
          review={selectedReview as any}
          onClose={() => setSelectedReview(null)}
          currentUserId={dbUser.id}
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
    </main>
  );
}
