import type { Metadata } from "next";
import { Mitr, Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import { FeedbackFAB } from "@/components/FeedbackFAB";

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

const notoSansThai = Noto_Sans_Thai_Looped({
  variable: "--font-noto",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GIntern — รีวิวฝึกงานจากรุ่นพี่ตัวจริง",
  description:
    "พื้นที่ปลอดภัยให้นักศึกษาแชร์ประสบการณ์ฝึกงานจริง ค้นหา เปรียบเทียบ และรีวิวที่ฝึกงานได้ในที่เดียว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${mitr.variable} ${notoSansThai.variable}`}>
      <body className="min-h-dvh flex flex-col bg-[--bg] text-[--ink] font-body antialiased">
        {children}
        <FeedbackFAB />
      </body>
    </html>
  );
}
