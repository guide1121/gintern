"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Calendar,
  Heart,
  MessageCircle,
  Coins,
  FileText,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import Link from "next/link";
import { ReviewModal } from "@/components/ReviewModal";
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
};

type Props = {
  targetUser: User & {
    reviews: DbReview[];
  };
  currentUserId: string | null;
};



export function PublicProfileContent({ targetUser, currentUserId }: Props) {
  const [selectedReview, setSelectedReview] = useState<DbReview | null>(null);
  const [shareReview, setShareReview] = useState<Review | null>(null);

  const initials = (targetUser.name || "?").charAt(0).toUpperCase();
  const joinDate = new Date(targetUser.createdAt).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric"
  });

  // คำนวณไลก์ทั้งหมดเฉพาะที่ได้รับจากรีวิวสาธารณะ (ที่ไม่ได้เปิด anonymous)
  const publicLikesReceived = targetUser.reviews.reduce((sum, r) => sum + r.likes.length, 0);

  // ตรวจสอบว่ามีข้อมูลเพื่อโชว์ Tag หรือไม่
  const hasTags = !!(targetUser.studyPlace || targetUser.workPlace || targetUser.fieldOfStudy);

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors duration-150 mb-6 group cursor-pointer"
        data-font="ui"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>กลับไปหน้าหลัก</span>
      </Link>

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
          {/* Avatar and Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Avatar */}
            {targetUser.image ? (
              <img
                src={targetUser.image}
                alt={targetUser.name}
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white bg-white ring-2 ring-primary-light shadow-sm relative z-10"
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary-light text-primary-ink flex items-center justify-center text-3xl font-medium border-4 border-white ring-2 ring-primary-light shadow-sm select-none relative z-10"
                data-font="ui"
              >
                {initials}
              </div>
            )}
          </div>

          {/* User Meta Data */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-medium text-ink" data-font="ui">
                  {targetUser.name}
                </h1>
                {targetUser.role && (
                  targetUser.role === "admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200" data-font="ui">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      ผู้ดูแลระบบ
                    </span>
                  ) : targetUser.role === "recommender" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" data-font="ui">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      ผู้แนะนำ
                    </span>
                  ) : targetUser.role === "reader" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200" data-font="ui">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      ผู้อ่าน
                    </span>
                  ) : null
                )}
              </div>
            </div>

            {/* Bio */}
            {targetUser.bio && (
              <p className="text-sm text-ink max-w-xl leading-relaxed mt-2" style={{ textWrap: "pretty" }}>
                {targetUser.bio}
              </p>
            )}

            {/* Social Media Info */}
            {(targetUser.instagram || targetUser.facebook) && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1 select-none">
                {targetUser.instagram && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium shadow-sm"
                    data-font="ui"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{targetUser.instagram}</span>
                  </div>
                )}
                {targetUser.facebook && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-600 font-medium shadow-sm"
                    data-font="ui"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{targetUser.facebook}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags (Only show when data exists in DB) */}
            {hasTags && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {targetUser.studyPlace && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light/20 border border-primary-light/40 text-xs text-primary-ink font-medium" data-font="ui">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>เรียนที่ {targetUser.studyPlace}</span>
                  </span>
                )}
                {targetUser.workPlace && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-xs text-accent-ink font-medium" data-font="ui">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>ทำงานที่ {targetUser.workPlace}</span>
                  </span>
                )}
                {targetUser.fieldOfStudy && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-emerald-800 font-medium" data-font="ui">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>สายการเรียน {targetUser.fieldOfStudy}</span>
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
                  <span className="text-lg font-bold text-primary mr-1" data-font="ui">{targetUser.reviews.length}</span>
                  <span className="text-muted text-xs font-normal">รีวิวที่เผยแพร่</span>
                </span>
                <span className="text-ink">
                  <span className="text-lg font-bold text-accent mr-1" data-font="ui">{publicLikesReceived}</span>
                  <span className="text-muted text-xs font-normal">ไลก์ที่ได้รับ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu (แสดงเฉพาะรีวิวสาธารณะ) */}
      <div className="mt-8 border-b border-border flex gap-6">
        <div className="pb-3 text-sm font-semibold text-primary relative" data-font="ui">
          รีวิวสาธารณะ ({targetUser.reviews.length})
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
        </div>
      </div>

      {/* Target Reviews Content */}
      <div className="mt-6">
        {targetUser.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {targetUser.reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={{ ...review, user: targetUser } as any} 
                currentUserId={currentUserId} 
                onCommentClick={(r) => setSelectedReview(r as any)}
                onShareClick={(r) => setShareReview(r as any)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="text-base font-medium text-ink mb-1" data-font="ui">ยังไม่มีรีวิวสาธารณะ</h3>
            <p className="text-muted text-sm">ผู้แนะนำคนนี้ยังไม่ได้เขียนรีวิวแบบเปิดเผยตัวตนในระบบ</p>
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewModal
          review={selectedReview as any}
          onClose={() => setSelectedReview(null)}
          currentUserId={currentUserId}
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
