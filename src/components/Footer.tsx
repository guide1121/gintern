import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto bg-white/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="GIntern"
            width={24}
            height={24}
            className="w-6 h-6 opacity-60"
          />
          <span className="font-semibold text-slate-700" data-font="ui">GIntern</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" data-font="ui">
          <Link
            href="/terms"
            className="hover:text-primary transition-colors duration-150 py-2.5 inline-block min-h-[44px] flex items-center"
          >
            ข้อกำหนดการใช้งาน
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors duration-150 py-2.5 inline-block min-h-[44px] flex items-center"
          >
            นโยบายความเป็นส่วนตัว
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors duration-150 py-2.5 inline-block min-h-[44px] flex items-center"
          >
            ติดต่อ
          </Link>
        </div>
      </div>
    </footer>
  );
}
