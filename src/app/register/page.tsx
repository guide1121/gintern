"use client";

import { useState } from "react";
import { register, loginWithGoogle } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกในรูปแบบ เช่น name@example.com");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(e.target.value)) {
        setEmailError("");
      }
    }
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      if (value.length < 6) {
        setPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      if (e.target.value.length >= 6) {
        setPasswordError("");
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailVal)) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกในรูปแบบ เช่น name@example.com");
      return;
    }

    const passwordVal = formData.get("password") as string;
    if (passwordVal.length < 6) {
      setPasswordError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 relative">
      {/* ปุ่มกลับหน้าแรก */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink font-medium px-3.5 py-2 rounded-xl hover:bg-surface-hover active:scale-95 transition-all duration-200 group cursor-pointer"
          data-font="ui"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>กลับหน้าแรก</span>
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group select-none active:scale-95 transition-transform duration-150">
            <Image src="/logo.png" alt="GIntern" width={40} height={40} className="w-10 h-10 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6" />
            <span className="text-2xl font-medium text-ink transition-transform duration-300 ease-out group-hover:translate-x-0.5" data-font="ui">GIntern</span>
          </Link>
          <p className="text-muted mt-2">สร้างบัญชีเพื่อแชร์ประสบการณ์</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 space-y-4">
          <form action={loginWithGoogle}>
            <button
               type="submit"
               className="w-full flex items-center justify-center gap-2 bg-bg border border-border py-2.5 rounded-xl font-medium text-ink hover:bg-surface-hover hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm transition-all duration-200 cursor-pointer"
              data-font="ui"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              สมัครด้วย Google
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted" data-font="ui">หรือ</span>
            <div className="flex-1 h-px bg-border" />
          </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1" data-font="ui">ชื่อที่แสดง</label>
             <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-bg rounded-xl px-4 py-2.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-primary focus:scale-[1.01] transition-all duration-200"
              placeholder="เช่น น้องมิ้นท์"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1" data-font="ui">อีเมล</label>
             <input
              id="email"
              name="email"
              type="email"
              required
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              className={`w-full bg-bg rounded-xl px-4 py-2.5 placeholder:text-muted outline-none transition-all duration-200 focus:scale-[1.01] focus:ring-2 ${
                emailError 
                  ? "text-red-600 focus:ring-red-500/30" 
                  : "text-ink focus:ring-primary"
              }`}
              style={{ border: `1px solid ${emailError ? '#EF4444' : 'transparent'}` }}
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="text-xs mt-1.5 ml-1 animate-fade-in" style={{ color: '#EF4444' }} data-font="ui">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1" data-font="ui">รหัสผ่าน</label>
             <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              onBlur={handlePasswordBlur}
              onChange={handlePasswordChange}
              className={`w-full bg-bg rounded-xl px-4 py-2.5 placeholder:text-muted outline-none transition-all duration-200 focus:scale-[1.01] focus:ring-2 ${
                passwordError 
                  ? "text-red-600 focus:ring-red-500/30" 
                  : "text-ink focus:ring-primary"
              }`}
              style={{ border: `1px solid ${passwordError ? '#EF4444' : 'transparent'}` }}
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
            {passwordError && (
              <p className="text-xs mt-1.5 ml-1 animate-fade-in" style={{ color: '#EF4444' }} data-font="ui">
                {passwordError}
              </p>
            )}
          </div>

           <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-ink py-2.5 rounded-xl font-medium hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] hover:shadow-md disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 transition-all duration-200 cursor-pointer group"
            data-font="ui"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังสมัครสมาชิก...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span>สมัครสมาชิก</span>
              </>
            )}
          </button>
        </form>
        </div>

         <p className="text-center text-sm text-muted mt-6 flex items-center justify-center gap-1" data-font="ui">
          <span>มีบัญชีผู้ใช้อยู่แล้ว?</span>
          <Link
            href="/login"
            className="text-primary font-semibold relative py-0.5 group inline-flex items-center active:scale-95 transition-transform duration-100 cursor-pointer"
          >
            <span>เข้าสู่ระบบ</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </Link>
        </p>
      </div>
    </div>
  );
}
