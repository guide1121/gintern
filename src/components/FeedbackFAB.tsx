"use client";

import { useState } from "react";
import { MessageCircle, X, Send, CheckCircle2, ChevronDown, PartyPopper, Smile } from "lucide-react";
import { createFeedback } from "@/app/actions/feedback";

export function FeedbackFAB() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    const result = await createFeedback({ name, email, subject: "Feedback via Chat", message });
    if (result.error) {
      alert(result.error);
      setStatus("idle");
    } else {
      setStatus("success");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      {/* FAB Button */}
      <button
        id="feedback-fab-btn"
        onClick={() => setOpen(!open)}
        aria-label="ส่ง Feedback"
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full transition-shadow duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
          open
            ? "bg-surface border border-border rotate-0 scale-100 shadow-md"
            : "bg-primary text-primary-ink hover:bg-primary-hover shadow-md hover:shadow-lg active:scale-95"
        }`}
        style={{
          boxShadow: open
            ? "var(--shadow-md)"
            : "0 8px 24px 0 oklch(0.76 0.08 220 / 0.35)",
        }}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-ink transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          id="feedback-chat-panel"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-surface"
          style={{
            animation: "fabSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-ink">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight" data-font="ui">
                  ส่ง Feedback ถึงทีมงาน
                </p>
                <p className="text-xs text-primary-ink/70 leading-tight">GIntern · ตอบภายใน 24 ชม.</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-surface">
            {status === "success" ? (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm flex items-center justify-center gap-1.5" data-font="ui">
                    <span>ส่งข้อความสำเร็จแล้ว!</span>
                    <PartyPopper className="w-4 h-4 text-emerald-600 animate-bounce" />
                  </p>
                  <p className="text-muted text-xs mt-1 leading-relaxed">
                    ทีมงานได้รับข้อความแล้ว<br />และจะติดต่อกลับทางอีเมลโดยเร็ว
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-primary underline cursor-pointer hover:no-underline mt-1"
                >
                  ส่งข้อความใหม่อีกครั้ง
                </button>
              </div>
            ) : (
              <>
                {/* Chat bubble intro */}
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-3.5 h-3.5 text-primary-ink" />
                  </div>
                  <div className="bg-primary-light/30 border border-primary-light/50 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                    <p className="text-xs text-ink leading-relaxed flex items-start gap-1">
                      <Smile className="w-3.5 h-3.5 text-primary shrink-0 inline -mt-0.5 mr-1" />
                      <span>สวัสดีครับ มีข้อเสนอแนะ พบบั๊ก หรืออยากบอกอะไรทีมงานไหม? พิมพ์มาได้เลย!</span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="fab-name" className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                        ชื่อ
                      </label>
                      <input
                        id="fab-name"
                        type="text"
                        required
                        disabled={status === "sending"}
                        placeholder="ชื่อของคุณ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[38px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="fab-email" className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                        อีเมล
                      </label>
                      <input
                        id="fab-email"
                        type="email"
                        required
                        disabled={status === "sending"}
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 min-h-[38px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="fab-message" className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                      ข้อความ
                    </label>
                    <textarea
                      id="fab-message"
                      required
                      rows={4}
                      disabled={status === "sending"}
                      placeholder="เขียนสิ่งที่ต้องการบอกทีมงาน..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs text-ink placeholder:text-muted outline-none focus:border-primary shadow-md focus:shadow-lg transition-shadow duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending" || !name.trim() || !email.trim() || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-ink font-semibold text-xs py-2.5 px-4 rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg active:scale-[0.98] transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer min-h-[40px]"
                    data-font="ui"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-primary-ink/30 border-t-primary-ink rounded-full animate-spin" />
                        <span>กำลังส่ง...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>ส่งข้อความ</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fabSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      ` }} />
    </>
  );
}
