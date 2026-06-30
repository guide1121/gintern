"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, User, LogOut, ShieldAlert, X, MessageSquare, Menu, Home, Search, Info, LogIn } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ProfilePromptModal } from "@/components/ProfilePromptModal";

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
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const shouldPrompt = localStorage.getItem("showProfilePrompt");
      if (shouldPrompt === "true") {
        setShowProfilePrompt(true);
        localStorage.removeItem("showProfilePrompt");
      }
    }
  }, [user]);

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

  const navLinks = [
    { href: "/", label: "หน้าแรก", icon: Home, exact: true },
    { href: "/search", label: "ค้นหารีวิว", icon: Search, exact: false },
    { href: "/about", label: "เกี่ยวกับเรา", icon: Info, exact: true },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 mr-2 group select-none active:scale-95 transition-transform duration-100">
              <Image src="/logo.png" alt="" aria-hidden="true" width={32} height={32} className="w-8 h-8 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6" />
              <span className="text-lg font-medium text-ink transition-transform duration-300 ease-out group-hover:translate-x-0.5" data-font="ui">GIntern</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 ml-6">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-all duration-150 relative py-1.5 group select-none active:scale-95 ${
                      active
                        ? "text-primary-ink font-semibold"
                        : "text-muted hover:text-ink"
                    }`}
                    data-font="ui"
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-transform duration-300 origin-center ${
                        active
                          ? "bg-primary scale-x-100"
                          : "bg-primary/30 scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setOpen(!open)}
                  className="rounded-full ring-2 ring-primary-light hover:ring-primary hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 translate-y-0.5"
                  aria-expanded={open}
                  aria-label="เมนูโปรไฟล์"
                >
                  <Avatar src={user.image} name={user.name} size={36} />
                </button>

                {open && (
                  /* Dropdown Menu - สำหรับ Desktop เท่านั้น */
                  <div
                    ref={menuRef}
                    role="menu"
                    className="hidden md:block absolute right-0 top-full mt-2 w-64 bg-surface rounded-2xl py-2 border border-border z-40 origin-top-right animate-dropdown shadow-lg"
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
                      <div className="px-2 pt-1 pb-1">
                        <Link
                          href="/profile"
                          onClick={() => setOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl text-primary-ink bg-primary-light hover:bg-primary transition-all duration-200 group active:scale-[0.98] shadow-sm"
                          data-font="ui"
                        >
                          <User className="w-4 h-4 text-primary-ink transition-transform duration-200 group-hover:scale-110" />
                          <span className="transition-transform duration-200 group-hover:translate-x-1">โปรไฟล์ของฉัน</span>
                        </Link>
                      </div>

                      <div className="border-b border-border my-1 opacity-60" />

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 font-medium transition-all duration-200 group active:scale-[0.98]"
                          data-font="ui"
                        >
                          <ShieldAlert className="w-4 h-4 text-rose-500 transition-transform duration-200 group-hover:scale-110" />
                          <span className="transition-transform duration-200 group-hover:translate-x-1">ระบบผู้ดูแลระบบ</span>
                        </Link>
                      )}
                      <Link
                        href="/review/new"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98]"
                        data-font="ui"
                      >
                        <PenLine className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-transform duration-200 group-hover:translate-x-1">เขียนรีวิว</span>
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98]"
                        data-font="ui"
                      >
                        <MessageSquare className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-transform duration-200 group-hover:translate-x-1">ส่ง Feedback / ติดต่อเรา</span>
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
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted hover:text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98] cursor-pointer text-left"
                          data-font="ui"
                        >
                          <LogOut className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                          <span className="transition-transform duration-200 group-hover:translate-x-1">ออกจากระบบ</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.96] transition-all duration-200 cursor-pointer group"
                  data-font="ui"
                >
                  <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-1.5" />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-muted hover:text-ink rounded-xl hover:bg-surface-hover transition-all duration-200 hover:scale-108 active:scale-90 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center group"
              aria-expanded={open}
              aria-label="เมนูนำทาง"
            >
              <Menu className="w-6 h-6 transition-transform duration-200 group-active:rotate-12" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer - สำหรับ Mobile เท่านั้น */}
      {open && (
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
              {user ? (
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
              ) : (
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="" aria-hidden="true" width={28} height={28} className="w-7 h-7" />
                  <span className="text-base font-medium text-ink" data-font="ui">GIntern</span>
                </div>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-ink rounded-xl hover:bg-surface-hover transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="ปิดเมนู"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
              {/* Navigation Group */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted/60 px-3 uppercase tracking-wider mb-2" data-font="ui">นำทาง</p>
                {navLinks.map((link) => {
                  const active = isActive(link.href, link.exact);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group active:scale-[0.98] min-h-[44px] ${
                        active
                          ? "bg-primary-light text-primary-ink font-semibold"
                          : "text-ink hover:bg-surface-hover"
                      }`}
                      data-font="ui"
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? "text-primary-ink" : "text-muted group-hover:text-ink"}`} />
                      <span className="transition-transform duration-200 group-hover:translate-x-1">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Group or Guest Callout */}
              {user ? (
                <>
                  <div className="border-b border-border opacity-60" />
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted/60 px-3 uppercase tracking-wider mb-2" data-font="ui">ผู้ใช้งาน</p>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98] min-h-[44px]"
                      data-font="ui"
                    >
                      <User className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-transform duration-200 group-hover:translate-x-1">โปรไฟล์ของฉัน</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/50 transition-all duration-200 group active:scale-[0.98] min-h-[44px]"
                        data-font="ui"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-500 transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-transform duration-200 group-hover:translate-x-1">ระบบผู้ดูแลระบบ</span>
                      </Link>
                    )}
                    <Link
                      href="/review/new"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98] min-h-[44px]"
                      data-font="ui"
                    >
                      <PenLine className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-transform duration-200 group-hover:translate-x-1">เขียนรีวิว</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-surface-hover transition-all duration-200 group active:scale-[0.98] min-h-[44px]"
                      data-font="ui"
                    >
                      <MessageSquare className="w-4 h-4 text-muted group-hover:text-ink transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-transform duration-200 group-hover:translate-x-1">ส่ง Feedback / ติดต่อเรา</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-border opacity-60" />
                  <div className="pt-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-primary-ink bg-primary hover:bg-primary-hover transition-all duration-200 active:scale-[0.98] shadow-md min-h-[48px] group"
                      data-font="ui"
                    >
                      <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-1" />
                      <span>เข้าสู่ระบบ</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Footer LogOut */}
            {user && (
              <div className="p-4 border-t border-border bg-surface">
                <form action={async () => {
                  await logout();
                  window.location.href = "/";
                }}>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:text-rose-700 transition-colors cursor-pointer text-center min-h-[48px]"
                    data-font="ui"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            )}
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
        @keyframes dropdownReveal {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-dropdown {
          animation: dropdownReveal 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />

      {/* Modal Profile Completion Prompt */}
      <ProfilePromptModal 
        isOpen={showProfilePrompt} 
        onClose={() => setShowProfilePrompt(false)} 
      />
    </>
  );
}

