"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PenLine, User, LogOut, ShieldAlert, X, MessageSquare } from "lucide-react";
import { logout } from "@/app/actions/auth";

type Props = {
  user?: { name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
};

function Avatar({
  src,
  name,
  size = 32,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
}) {
  const initials = (name || "?").charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="rounded-full bg-primary-light text-primary-ink flex items-center justify-center font-medium select-none"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      data-font="ui"
    >
      {initials}
    </div>
  );
}

export function Navbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (typeof window !== "undefined" && window.innerWidth < 768) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-bg backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" aria-hidden="true" width={32} height={32} className="w-8 h-8" />
            <span className="text-lg font-medium text-ink" data-font="ui">GIntern</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="rounded-full ring-2 ring-primary-light hover:ring-primary transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 translate-y-0.5"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="เมนูโปรไฟล์"
              >
                <Avatar src={user.image} name={user.name} size={36} />
              </button>

              {open && (
                /* Dropdown Menu - สำหรับ Desktop เท่านั้น */
                <div
                  ref={menuRef}
                  role="menu"
                  className="hidden md:block absolute right-0 top-full mt-2 w-64 bg-surface rounded-2xl py-2 border border-border z-40 origin-top-right animate-in"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-ink truncate" data-font="ui">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                    )}
                  </div>

                  <div className="py-1">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 font-medium transition-colors duration-150"
                        data-font="ui"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        ระบบผู้ดูแลระบบ
                      </Link>
                    )}
                    <Link
                      href="/review/new"
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-colors duration-150"
                      data-font="ui"
                    >
                      <PenLine className="w-4 h-4" />
                      เขียนรีวิว
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-colors duration-150"
                      data-font="ui"
                    >
                      <User className="w-4 h-4" />
                      โปรไฟล์ของฉัน
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-colors duration-150"
                      data-font="ui"
                    >
                      <MessageSquare className="w-4 h-4" />
                      ส่ง Feedback / ติดต่อเรา
                    </Link>
                  </div>

                  <div className="border-t border-border pt-1">
                    <form action={async () => {
                      await logout();
                      window.location.href = "/";
                    }}>
                      <button
                        type="submit"
                        role="menuitem"
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted hover:text-ink hover:bg-surface-hover transition-colors duration-150 cursor-pointer text-left"
                        data-font="ui"
                      >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-primary-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors active:scale-[0.97] cursor-pointer"
              data-font="ui"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar Drawer - สำหรับ Mobile เท่านั้น (ย้ายออกนอก Relative container ของปุ่ม และนอก nav เพื่อป้องกันปัญหา Stacking Context จาก backdrop-blur บน nav) */}
      {user && open && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl flex flex-col z-[51] animate-slide-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={user.image} name={user.name} size={40} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate" data-font="ui">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-ink rounded-xl hover:bg-surface-hover transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="ปิดเมนู"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-surface">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/50 transition-colors min-h-[48px]"
                  data-font="ui"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-500 mr-3.5" />
                  <span>ระบบผู้ดูแลระบบ</span>
                </Link>
              )}
              <Link
                href="/review/new"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-colors min-h-[48px]"
                data-font="ui"
              >
                <PenLine className="w-5 h-5 text-muted mr-3.5" />
                <span>เขียนรีวิว</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-colors min-h-[48px]"
                data-font="ui"
              >
                <User className="w-5 h-5 text-muted mr-3.5" />
                <span>โปรไฟล์ของฉัน</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-colors min-h-[48px]"
                data-font="ui"
              >
                <MessageSquare className="w-5 h-5 text-muted mr-3.5" />
                <span>ส่ง Feedback / ติดต่อเรา</span>
              </Link>
            </div>

            {/* Footer LogOut */}
            <div className="p-4 border-t border-border bg-surface">
              <form action={async () => {
                await logout();
                window.location.href = "/";
              }}>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:text-rose-700 transition-colors cursor-pointer text-center min-h-[48px]"
                  data-font="ui"
                >
                  <LogOut className="w-5 h-5 text-rose-500" />
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Local Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}} />
    </>
  );
}
