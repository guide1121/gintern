"use client";

import { useState, useRef } from "react";
import { X, Download, Share2, Sparkles, Check, Copy } from "lucide-react";
import { toPng } from "html-to-image";
import { ExperienceBadge, Stars } from "./ReviewFeed";

type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string | null;
};

type User = {
  id: string;
  name: string;
  image: string | null;
  role: string | null;
};

type Review = {
  id: string;
  company: Company;
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
  user?: User | null;
};

type Props = {
  review: Review;
  onClose: () => void;
};

// สไตล์พื้นหลังที่สามารถเลือกเปลี่ยนได้
const BACKGROUND_THEMES = [
  {
    id: "blue-gradient",
    name: "ฟ้าพาสเทล",
    class: "from-[#F1FAFA] to-[#BFE2F5] text-[#1E4E68]",
    cardBg: "bg-white/85 backdrop-blur-md border border-[#D6F0E8]/50",
    badgeBg: "bg-[#7FC1E8]/20 text-[#1E4E68]",
    ratingBarBg: "bg-[#7FC1E8]/30",
    accentColor: "bg-[#7FC1E8] text-[#1E4E68]",
  },
  {
    id: "mint-gradient",
    name: "เขียวมินต์",
    class: "from-[#F1FAFA] to-[#A2E8D2] text-[#1B4B3D]",
    cardBg: "bg-white/85 backdrop-blur-md border border-[#7DD0B8]/30",
    badgeBg: "bg-[#7DD0B8]/20 text-[#1B4B3D]",
    ratingBarBg: "bg-[#7DD0B8]/30",
    accentColor: "bg-[#7DD0B8] text-[#1B4B3D]",
  },
  {
    id: "peach-sunset",
    name: "ชมพูพีช",
    class: "from-[#FFF5F2] to-[#FED6CD] text-[#70382E]",
    cardBg: "bg-white/85 backdrop-blur-md border border-[#FED6CD]/50",
    badgeBg: "bg-[#FF8A75]/20 text-[#70382E]",
    ratingBarBg: "bg-[#FF8A75]/30",
    accentColor: "bg-[#FF8A75] text-[#70382E]",
  },
  {
    id: "candy-galaxy",
    name: "แคนดี้กาแล็กซี่",
    class: "from-[#E3F2FD] via-[#F3E5F5] to-[#FCE4EC] text-[#4A148C]",
    cardBg: "bg-white/85 backdrop-blur-md border border-purple-200/50",
    badgeBg: "bg-purple-100 text-[#4A148C]",
    ratingBarBg: "bg-purple-200/50",
    accentColor: "bg-[#BA68C8] text-white",
  },
];

export function ShareCardModal({ review, onClose }: Props) {
  const [selectedTheme, setSelectedTheme] = useState(BACKGROUND_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const displayName = review.isAnonymous ? "รุ่นพี่ไม่ระบุตัวตน" : (review.user?.name || "ผู้ใช้งาน");
  const initials = review.isAnonymous ? "พี่" : (review.user?.name || "?").charAt(0).toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // ตัดเนื้อหารีวิวส่วนท้ายออกหากยาวเกินไปสำหรับการ์ดแชร์
  const maxContentLength = 260;
  const truncatedContent =
    review.content.length > maxContentLength
      ? review.content.substring(0, maxContentLength) + "..."
      : review.content;

  // ฟังก์ชันดาวน์โหลดภาพ PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      // รอให้ฟอนต์และรูปภาพพร้อม
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // เพิ่มความละเอียดเพื่อภาพที่คมชัด
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `gintern-review-${review.company.name.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("เกิดข้อผิดพลาดในการสร้างภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };

  // ฟังก์ชันใช้ Web Share API ในการแชร์ภาพหรือลิงก์
  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      // แปลง base64 เป็น blob และไฟล์ เพื่อใช้ส่งใน Web Share API
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "gintern-review.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `รีวิวฝึกงานที่ ${review.company.name}`,
          text: `อ่านรีวิวฝึกงานสุดจริงจากรุ่นพี่ได้ที่ GIntern!`,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        // Fallback: หากเบราว์เซอร์ไม่รองรับการส่งไฟล์ ให้แชร์ลิงก์แทน
        await navigator.clipboard.writeText(`${window.location.origin}/search?q=${encodeURIComponent(review.company.name)}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/search?q=${encodeURIComponent(review.company.name)}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("ไม่สามารถแชร์หรือคัดลอกลิงก์ได้ในขณะนี้");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/search?q=${encodeURIComponent(review.company.name)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("คัดลอกลิงก์ไม่สำเร็จ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative z-10 max-h-[95vh] sm:max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-ink hover:bg-slate-100 p-2 rounded-full transition-colors z-20 cursor-pointer"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Card Preview Container */}
        <div className="w-full md:w-3/5 bg-slate-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border overflow-y-auto min-h-[460px] sm:min-h-[500px]">
          <span className="text-xs text-muted mb-3 flex items-center gap-1 font-medium" data-font="ui">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> พรีวิวการ์ดที่จะเซฟ (ขนาด 9:16 สำหรับ Story)
          </span>

          {/* การ์ดที่เราจะแปลงเป็นรูปภาพ */}
          <div className="relative shadow-xl rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-white">
            <div
              ref={cardRef}
              className={`w-[320px] h-[568px] bg-gradient-to-br ${selectedTheme.class} p-5 flex flex-col justify-between select-none relative`}
            >
              {/* แถบหัวการ์ด (Header) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/90 shadow-sm flex items-center justify-center font-bold text-[#1E4E68] text-base" data-font="ui">
                      GI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-wide uppercase opacity-90" data-font="ui">GIntern</h4>
                      <p className="text-[8px] opacity-75 leading-none">รีวิวฝึกงานจากรุ่นพี่</p>
                    </div>
                  </div>
                  <ExperienceBadge type={review.experienceType} />
                </div>

                {/* เนื้อหารีวิวหลัก */}
                <div className={`${selectedTheme.cardBg} rounded-2xl p-4 mb-4 relative`}>
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#7FC1E8]/20 flex items-center justify-center text-xs font-bold shrink-0 border border-white/40" data-font="ui">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate" data-font="ui">{displayName}</p>
                      <p className="text-[9px] opacity-75 truncate">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-300/40 my-2" />

                  <h3 className="text-sm font-extrabold line-clamp-1" data-font="ui">
                    {review.company.name}
                  </h3>
                  <p className="text-[10px] opacity-80 mb-2 font-medium">
                    ตำแหน่ง: {review.position}
                  </p>

                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Stars rating={review.ratingOverall} />
                    <span className="text-xs font-bold" data-font="ui">{review.ratingOverall}</span>
                  </div>

                  <p className="text-[11px] leading-relaxed line-clamp-6 opacity-90 font-medium">
                    “{truncatedContent}”
                  </p>
                </div>
              </div>

              {/* ส่วนล่างของการ์ด (คะแนนมิติและ footer) */}
              <div>
                <div className={`${selectedTheme.cardBg} rounded-2xl p-3.5 mb-3.5 space-y-1.5`}>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>พี่เลี้ยงดูแล</span>
                    <span>{review.ratingMentor}/5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                    <div className={`h-full rounded-full ${selectedTheme.accentColor}`} style={{ width: `${(review.ratingMentor / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>ได้เรียนรู้สิ่งใหม่</span>
                    <span>{review.ratingLearning}/5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                    <div className={`h-full rounded-full ${selectedTheme.accentColor}`} style={{ width: `${(review.ratingLearning / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>ปริมาณงาน/เวลา</span>
                    <span>{review.ratingWorkload}/5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                    <div className={`h-full rounded-full ${selectedTheme.accentColor}`} style={{ width: `${(review.ratingWorkload / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>วัฒนธรรมองค์กร</span>
                    <span>{review.ratingCulture}/5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                    <div className={`h-full rounded-full ${selectedTheme.accentColor}`} style={{ width: `${(review.ratingCulture / 5) * 100}%` }} />
                  </div>
                </div>

                {/* Footer ลายน้ำเพื่อชวนให้คนเสิร์ช */}
                <div className="flex items-center justify-between border-t border-white/20 pt-3">
                  {review.pay ? (
                    <div>
                      <p className="text-[8px] opacity-75">เบี้ยเลี้ยงที่ได้รับ</p>
                      <p className="text-[11px] font-bold" data-font="ui">
                        {review.pay.toLocaleString()} {review.payType || "บาท/เดือน"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[8px] opacity-75">ที่ฝึกงานนี้</p>
                      <p className="text-[10px] font-bold" data-font="ui">ไม่ระบุเบี้ยเลี้ยง</p>
                    </div>
                  )}

                  <div className="text-right">
                    <p className="text-[8px] opacity-75">ค้นหารีวิวจริงเพิ่มเติม</p>
                    <p className="text-[10px] font-extrabold tracking-tight" data-font="ui">
                      gintern.vercel.app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Controls and Options */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-none">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-ink mb-1" data-font="ui">ปรับแต่งการ์ดรีวิว</h3>
              <p className="text-xs text-muted">เลือกโทนสีการ์ดที่คุณชื่นชอบเพื่อแชร์</p>
            </div>

            {/* ธีมสีพื้นหลัง */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-ink" data-font="ui">สีพื้นหลัง</span>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_THEMES.map((theme) => {
                  const isSelected = selectedTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary-light/10 text-primary font-bold shadow-sm"
                          : "border-border hover:bg-slate-50 text-ink"
                      }`}
                      data-font="ui"
                    >
                      <span>{theme.name}</span>
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.class} border border-slate-300 shrink-0 flex items-center justify-center`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-current" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ข้อมูลคำเตือนเรื่อง CORS ใน Next.js */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/50 text-[11px] text-amber-800 leading-relaxed">
              💡 <strong>ข้อแนะนำ:</strong> ระบบทำการดึงข้อมูลและจำลองรูปภาพโปรไฟล์ด้วยชื่อย่อ เพื่อความลื่นไหลและปกป้องความเป็นส่วนตัวของคุณก่อนนำไปแชร์ต่อลงโซเชียลมีเดีย
            </div>
          </div>

          {/* ปุ่มสั่งการ */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-border">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full bg-primary text-primary-ink font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer text-sm"
              data-font="ui"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-ink border-t-transparent rounded-full animate-spin" />
                  กำลังสร้างรูปภาพ...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  บันทึกเป็นรูปภาพ (PNG)
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="w-full bg-[#1E4E68] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E4E68]/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer text-sm"
              data-font="ui"
            >
              <Share2 className="w-4 h-4" />
              {shareSuccess ? "แชร์เรียบร้อยแล้ว!" : "แชร์ตรงไปยังโซเชียล"}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full bg-white border border-border text-ink hover:bg-slate-50 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm cursor-pointer text-xs"
              data-font="ui"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  คัดลอกลิงก์สำเร็จแล้ว!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted" />
                  คัดลอกลิงก์สืบค้นเพื่อแชร์
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
