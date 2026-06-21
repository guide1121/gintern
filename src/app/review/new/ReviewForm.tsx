"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, Coins, Lock, Unlock, Sparkles, AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { createReview, updateReview } from "@/app/actions/review";

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-b-0">
      <span className="text-ink text-sm font-medium" data-font="ui">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl transition-transform duration-100 active:scale-90 hover:scale-110 cursor-pointer focus:outline-none"
            aria-label={`${label} ${star} ดาว`}
          >
            <span className={star <= value ? "text-star" : "text-slate-200"}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type InitialReviewData = {
  id: string;
  companyName: string;
  industry: string;
  position: string;
  experienceType: string;
  ratingMentor: number;
  ratingLearning: number;
  ratingWorkload: number;
  ratingCulture: number;
  pay: string;
  payType: string;
  content: string;
  isAnonymous: boolean;
};

export function ReviewForm({ initialData }: { initialData?: InitialReviewData | null }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultIndustries = [
    "เทคโนโลยีและซอฟต์แวร์",
    "การเงินและธนาคาร",
    "การตลาดและโฆษณา",
    "การออกแบบและครีเอทีฟ",
    "บริการและการท่องเที่ยว",
    "อาหารและเครื่องดื่ม"
  ];

  // Form State
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [industry, setIndustry] = useState(
    initialData
      ? defaultIndustries.includes(initialData.industry)
        ? initialData.industry
        : "อื่นๆ"
      : "เทคโนโลยีและซอฟต์แวร์"
  );
  const [customIndustry, setCustomIndustry] = useState(
    initialData && !defaultIndustries.includes(initialData.industry)
      ? initialData.industry
      : ""
  );
  const [position, setPosition] = useState(initialData?.position || "");
  const [experienceType, setExperienceType] = useState(initialData?.experienceType || "intern");
  const [ratingMentor, setRatingMentor] = useState(initialData?.ratingMentor ?? 5);
  const [ratingLearning, setRatingLearning] = useState(initialData?.ratingLearning ?? 5);
  const [ratingWorkload, setRatingWorkload] = useState(initialData?.ratingWorkload ?? 5);
  const [ratingCulture, setRatingCulture] = useState(initialData?.ratingCulture ?? 5);
  const [pay, setPay] = useState(initialData?.pay || "");
  const [payType, setPayType] = useState(initialData?.payType || "บาท/เดือน");
  const [content, setContent] = useState(initialData?.content || "");
  const [isAnonymous, setIsAnonymous] = useState(initialData?.isAnonymous ?? false);

  // คำนวณคะแนนรวมเฉลี่ยเรียลไทม์
  const ratingOverall = ((ratingMentor + ratingLearning + ratingWorkload + ratingCulture) / 4).toFixed(1);

  // การเปลี่ยนหน้าและตรวจสอบความถูกต้องแยกสเต็ป
  const handleNextToStep2 = () => {
    setError(null);
    if (!companyName.trim()) {
      setError("กรุณากรอกชื่อบริษัท");
      return;
    }
    if (industry === "อื่นๆ" && !customIndustry.trim()) {
      setError("กรุณาระบุประเภทธุรกิจของคุณ");
      return;
    }
    if (!position.trim()) {
      setError("กรุณากรอกตำแหน่งงาน");
      return;
    }
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setError(null);
    if (!content.trim()) {
      setError("กรุณากรอกรายละเอียดประสบการณ์รีวิว");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return; // ส่งฟอร์มได้เฉพาะสเต็ปที่ 3

    setLoading(true);
    setError(null);

    const finalIndustry = industry === "อื่นๆ" ? customIndustry.trim() : industry;
    const payValue = pay ? parseInt(pay) : null;

    const payload = {
      companyName: companyName.trim(),
      industry: finalIndustry,
      position: position.trim(),
      experienceType,
      ratingMentor,
      ratingLearning,
      ratingWorkload,
      ratingCulture,
      pay: payValue,
      payType: pay ? payType : null,
      content: content.trim(),
      isAnonymous,
    };

    let result;
    if (initialData?.id) {
      result = await updateReview(initialData.id, payload);
    } else {
      result = await createReview(payload);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2" data-font="ui">
          {initialData?.id ? "แก้ไขรีวิว" : "เขียนรีวิวใหม่"}
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          {initialData?.id 
            ? "ปรับแต่งข้อมูลประสบการณ์การฝึกงานหรือการทำงานจริงของคุณให้ถูกต้อง"
            : "แบ่งปันประสบการณ์ตรงของคุณเพื่อช่วยรุ่นน้องในการตัดสินใจเลือกที่ฝึกงานและที่ทำงานในฝัน"
          }
        </p>
      </div>

      {/* Progress Bar / Step Indicator */}
      <div className="mb-6 select-none bg-white rounded-2xl p-6 border border-border/20">
        <div className="flex justify-between items-center relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          {/* Active progress line */}
          <div 
            className="absolute top-5 left-8 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300 z-0" 
            style={{ width: `${((step - 1) / 2) * 82}%` }}
          />

          {/* Step circles */}
          {[1, 2, 3].map((s) => {
            const isActive = step >= s;
            const isCompleted = step > s;
            const isCurrent = step === s;
            return (
              <div key={s} className="flex flex-col items-center z-10 w-24">
                <button
                  type="button"
                  disabled={step < s && !isCompleted}
                  onClick={() => {
                    if (s === 1) {
                      setError(null);
                      setStep(1);
                    } else if (s === 2 && companyName.trim() && position.trim()) {
                      setError(null);
                      setStep(2);
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 focus:outline-none ${
                    isCurrent
                      ? "bg-primary text-primary-ink ring-4 ring-primary-light/50 font-bold"
                      : isCompleted
                        ? "bg-primary text-primary-ink cursor-pointer"
                        : "bg-surface text-muted border-2 border-slate-100 cursor-not-allowed"
                  }`}
                  data-font="ui"
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : s}
                </button>
                <span 
                  className={`text-xs mt-2 font-medium transition-all text-center whitespace-nowrap ${
                    isCurrent ? "text-ink font-semibold scale-105" : "text-muted"
                  }`}
                  data-font="ui"
                >
                  {s === 1 ? "ข้อมูลเบื้องต้น" : s === 2 ? "ประสบการณ์ & เงิน" : "ให้คะแนนรีวิว"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm animate-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* --- หน้าที่ 1: ข้อมูลเบื้องต้น + ไม่ระบุตัวตน --- */}
      {step === 1 && (
        <div className="flex flex-col gap-6 animate-in">
          <div className="bg-white rounded-2xl p-6 border border-border/20">
            <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-1.5" data-font="ui">
              <span>1. ข้อมูลเบื้องต้น</span>
            </h3>

            {/* สลับฝึกงาน / ทำงานจริง */}
            <div className="flex gap-2 p-1 bg-surface-hover rounded-xl w-fit mb-6">
              <button
                type="button"
                onClick={() => setExperienceType("intern")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  experienceType === "intern"
                    ? "bg-primary text-primary-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                data-font="ui"
              >
                <GraduationCap className="w-4 h-4" /> ฝึกงาน (Intern)
              </button>
              <button
                type="button"
                onClick={() => setExperienceType("employee")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  experienceType === "employee"
                    ? "bg-primary text-primary-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                data-font="ui"
              >
                <Briefcase className="w-4 h-4" /> ทำงานจริง (Employee)
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* ชื่อบริษัท */}
              <div>
                <label htmlFor="companyNameInput" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                  ชื่อบริษัท <span className="text-rose-500">*</span>
                </label>
                <input
                  id="companyNameInput"
                  type="text"
                  required
                  placeholder="เช่น Google, Lineman Wongnai, SCB"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-surface rounded-xl px-4 py-3 text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary transition-all duration-150 min-h-[44px]"
                />
              </div>

              {/* ประเภทธุรกิจ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industrySelect" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                    ประเภทธุรกิจ <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="industrySelect"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-ink outline-none border border-transparent focus:border-primary transition-all duration-150 cursor-pointer min-h-[44px]"
                    data-font="ui"
                  >
                    <option value="เทคโนโลยีและซอฟต์แวร์">เทคโนโลยีและซอฟต์แวร์</option>
                    <option value="การเงินและธนาคาร">การเงินและธนาคาร</option>
                    <option value="การตลาดและโฆษณา">การตลาดและโฆษณา</option>
                    <option value="การออกแบบและครีเอทีฟ">การออกแบบและครีเอทีฟ</option>
                    <option value="บริการและการท่องเที่ยว">บริการและการท่องเที่ยว</option>
                    <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                    <option value="อื่นๆ">อื่นๆ (ระบุเอง)</option>
                  </select>
                </div>

                {/* ช่องพิมพ์เมื่อเลือก อื่นๆ */}
                {industry === "อื่นๆ" && (
                  <div>
                    <label htmlFor="customIndustryInput" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                      ระบุประเภทธุรกิจอื่น ๆ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customIndustryInput"
                      type="text"
                      required
                      placeholder="เช่น อสังหาริมทรัพย์, การศึกษา"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      className="w-full bg-surface rounded-xl px-4 py-3 text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary transition-all duration-150 min-h-[44px]"
                    />
                  </div>
                )}
              </div>

              {/* ตำแหน่งงาน */}
              <div>
                <label htmlFor="positionInput" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                  ตำแหน่งงาน <span className="text-rose-500">*</span>
                </label>
                <input
                  id="positionInput"
                  type="text"
                  required
                  placeholder="เช่น Software Engineer, UX/UI Intern, HR"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-surface rounded-xl px-4 py-3 text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary transition-all duration-150 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* ปิดบังตัวตน (Anonymous) */}
          <div className="flex items-center justify-between p-4 bg-primary-light/20 border border-primary-light/50 rounded-xl">
            <div className="flex items-start gap-3">
              {isAnonymous ? (
                <Lock className="w-5 h-5 text-primary-ink shrink-0 mt-0.5" />
              ) : (
                <Unlock className="w-5 h-5 text-muted shrink-0 mt-0.5" />
              )}
              <div>
                <h4 id="anonymous-label" className="text-sm font-semibold text-ink" data-font="ui">เขียนแบบไม่ระบุตัวตน</h4>
                <p id="anonymous-desc" className="text-xs text-muted">ซ่อนชื่อและรูปโปรไฟล์ของคุณบนโพสต์รีวิวนี้ เพื่อความเป็นส่วนตัวสูงสุด</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:outline-none ${
                isAnonymous ? "bg-accent" : "bg-slate-200"
              }`}
              role="switch"
              aria-checked={isAnonymous}
              aria-labelledby="anonymous-label"
              aria-describedby="anonymous-desc"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnonymous ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* ปุ่มควบคุม */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleNextToStep2}
              className="bg-primary text-primary-ink font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
              data-font="ui"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- หน้าที่ 2: ประสบการณ์ และเบี้ยเลี้ยง --- */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-in">
          <div className="bg-white rounded-2xl p-6 border border-border/20">
            <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-1.5" data-font="ui">
              <span>2. รายละเอียดประสบการณ์และค่าเบี้ยเลี้ยง</span>
            </h3>

            <div className="flex flex-col gap-4">
              {/* รายละเอียดรีวิว */}
              <div>
                <label htmlFor="contentTextarea" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                  รีวิวประสบการณ์จริง <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contentTextarea"
                  required
                  placeholder="เล่าประสบการณ์จริงของคุณ บรรยากาศการทำงาน ข้อดี-ข้อเสีย หรือคำแนะนำเพื่อช่วยรุ่นน้องตัดสินใจ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-surface rounded-xl px-4 py-3 text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary transition-all duration-150 h-40 resize-none leading-relaxed"
                />
              </div>

              {/* เบี้ยเลี้ยง */}
              <div>
                <label htmlFor="payInput" className="block text-sm font-medium text-ink mb-1.5" data-font="ui">
                  ค่าเบี้ยเลี้ยง / เงินเดือน <span className="text-muted text-xs font-normal">(ไม่บังคับ)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="payInput"
                      type="number"
                      placeholder="เช่น 15000, 300"
                      value={pay}
                      onChange={(e) => setPay(e.target.value)}
                      className="w-full bg-surface rounded-xl pl-10 pr-4 py-3 text-ink placeholder:text-muted outline-none border border-transparent focus:border-primary transition-all duration-150 min-h-[44px]"
                    />
                  </div>
                  <select
                    id="payTypeSelect"
                    aria-label="หน่วยเบี้ยเลี้ยง"
                    value={payType}
                    onChange={(e) => setPayType(e.target.value)}
                    className="bg-surface rounded-xl px-4 py-3 text-ink outline-none border border-transparent focus:border-primary transition-all duration-150 cursor-pointer min-h-[44px]"
                    data-font="ui"
                  >
                    <option value="บาท/เดือน">บาท/เดือน</option>
                    <option value="บาท/วัน">บาท/วัน</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มควบคุม */}
          <div className="flex justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() => { setError(null); setStep(1); }}
              className="bg-surface text-ink font-semibold px-6 py-3 rounded-xl hover:bg-surface-hover active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center gap-1.5 border border-border/50 min-h-[44px]"
              data-font="ui"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
            <button
              type="button"
              onClick={handleNextToStep3}
              className="bg-primary text-primary-ink font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
              data-font="ui"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- หน้าที่ 3: รีวิวการให้คะแนนดาว --- */}
      {step === 3 && (
        <div className="flex flex-col gap-6 animate-in">
          <div className="bg-white rounded-2xl p-6 border border-border/20">
            <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
              <h3 className="text-base font-semibold text-ink flex items-center gap-1.5" data-font="ui">
                <span>3. การให้คะแนนดาว</span>
              </h3>
              <div className="flex items-center gap-1 bg-primary-light/30 border border-primary-light/50 px-3 py-1 rounded-full text-xs font-semibold text-primary-ink" data-font="ui">
                <Sparkles className="w-3.5 h-3.5" /> คะแนนรวมเฉลี่ย {ratingOverall} / 5.0
              </div>
            </div>

            <div className="flex flex-col">
              <StarRating value={ratingMentor} onChange={setRatingMentor} label="พี่เลี้ยง (ช่วยสอนงานและคอยดูแล)" />
              <StarRating value={ratingLearning} onChange={setRatingLearning} label="ความรู้ (ทักษะและสิ่งที่ได้เรียนรู้)" />
              <StarRating value={ratingWorkload} onChange={setRatingWorkload} label="ปริมาณงาน (เหมาะสมกับชั่วโมงงาน)" />
              <StarRating value={ratingCulture} onChange={setRatingCulture} label="วัฒนธรรม (บรรยากาศเป็นกันเองและเพื่อนร่วมงาน)" />
            </div>
          </div>

          {/* ปุ่มควบคุม */}
          <div className="flex justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() => { setError(null); setStep(2); }}
              className="bg-surface text-ink font-semibold px-6 py-3 rounded-xl hover:bg-surface-hover active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center gap-1.5 border border-border/50 min-h-[44px]"
              data-font="ui"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-primary text-primary-ink font-semibold px-8 py-3 rounded-xl shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              data-font="ui"
            >
              <span>{loading ? "กำลังบันทึก..." : initialData?.id ? "บันทึกการแก้ไข" : "เผยแพร่รีวิว"}</span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
