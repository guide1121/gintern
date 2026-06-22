"use client";

import { useState } from "react";
import { Send, CheckCircle2, Sparkles } from "lucide-react";
import { createFeedback } from "@/app/actions/feedback";

export function ContactForm({ initialUser }: { initialUser?: { name?: string | null; email?: string | null } }) {
  const [name, setName] = useState(initialUser?.name || "");
  const [email, setEmail] = useState(initialUser?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    const result = await createFeedback({
      name,
      email,
      subject,
      message,
    });

    if (result.error) {
      alert(result.error);
      setStatus("idle");
    } else {
      setStatus("success");
      setSubject("");
      setMessage("");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in">
        <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900" data-font="ui">
          ส่งข้อความสำเร็จแล้ว!
        </h3>
        <p className="text-emerald-700 text-sm max-w-md mx-auto">
          ขอบคุณสำหรับความคิดเห็นหรือข้อสงสัย ทีมงาน GIntern ได้รับข้อความของคุณเรียบร้อยแล้ว และจะติดต่อกลับทางอีเมล <span className="font-semibold">{email}</span> โดยเร็วที่สุด
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 inline-flex items-center gap-1.5 bg-emerald-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer min-h-[44px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>เขียนข้อความใหม่</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="contact-name" className="text-xs font-semibold text-slate-600">ชื่อของคุณ</label>
          <input
            id="contact-name"
            type="text"
            required
            disabled={status === "sending"}
            placeholder="เช่น สมชาย ใจดี"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[44px]"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contact-email" className="text-xs font-semibold text-slate-600">อีเมลติดต่อกลับ</label>
          <input
            id="contact-email"
            type="email"
            required
            disabled={status === "sending"}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[44px]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-600">หัวเรื่อง</label>
        <input
          id="contact-subject"
          type="text"
          disabled={status === "sending"}
          placeholder="เช่น มีข้อเสนอแนะเกี่ยวกับฟีเจอร์ใหม่"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[44px]"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-message" className="text-xs font-semibold text-slate-600">ข้อความ</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          disabled={status === "sending"}
          placeholder="พิมพ์ข้อความของคุณที่ต้องการติดต่อทีมงานได้ที่นี่..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 resize-none min-h-[120px]"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending" || !name.trim() || !email.trim() || !message.trim()}
        className="w-full bg-primary text-primary-ink font-semibold py-3 px-5 rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg active:scale-[0.98] transition-shadow duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer min-h-[44px]"
      >
        {status === "sending" ? (
          <>
            <span className="w-4 h-4 border-2 border-primary-ink/30 border-t-primary-ink rounded-full animate-spin" />
            <span>กำลังส่งข้อความ...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>ส่งข้อความ</span>
          </>
        )}
      </button>
    </form>
  );
}
