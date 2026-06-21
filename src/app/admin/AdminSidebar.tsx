"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Home, ShieldAlert, MessageSquare, Menu, X } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "แดชบอร์ดหลัก",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "จัดการบัญชีสมาชิก",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "จัดการโพสต์รีวิว",
      href: "/admin/reviews",
      icon: FileText,
    },
    {
      name: "ข้อเสนอแนะ (Feedback)",
      href: "/admin/feedback",
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 md:h-screen sticky top-0 z-30">
      {/* Sidebar Header & Toggle */}
      <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-ink shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wider text-slate-100" data-font="ui">
              GIntern Admin
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">ระบบควบคุมหลังบ้าน</p>
          </div>
        </div>

        {/* Toggle button on Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
          aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:flex flex-col flex-1 justify-between`}>
        <nav className="p-4 space-y-1.5" data-font="ui">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                onClick={() => setIsOpen(false)}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-ink shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800" data-font="ui">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>กลับไปหน้าเว็บไซต์</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
