import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import { Shield, Lock, EyeOff } from "lucide-react";

export default async function PrivacyPage() {
  const session = await auth();
  let currentUser = session?.user;

  if (session?.user && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, role: true },
    });
    if (dbUser) {
      currentUser = {
        ...session.user,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
      };
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={currentUser} />
      
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-primary-light/50 text-primary-ink mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-ink" data-font="ui">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-muted text-sm mt-2">ปรับปรุงล่าสุดเมื่อ 21 มิถุนายน 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-ink/90">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              <Lock className="w-5 h-5 text-primary" />
              1. ข้อมูลที่เราจัดเก็บ
            </h2>
            <p>
              เราจัดเก็บข้อมูลที่จำเป็นต่อการให้บริการ ได้แก่ ข้อมูลโปรไฟล์จากการล็อกอิน (อีเมล, ชื่อ, รูปโปรไฟล์) รวมถึงข้อมูลสถานศึกษาและสาขาวิชาในกรณีที่คุณเลือกกรอกเพื่อระบุตัวตน ข้อมูลเหล่านี้จะถูกใช้เพื่อยืนยันตัวตนและการเข้าสู่ระบบเท่านั้น
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              <EyeOff className="w-5 h-5 text-primary" />
              2. ความปลอดภัยในระบบไม่ระบุตัวตน (Anonymous Guard)
            </h2>
            <p>
              GIntern ยึดมั่นในการปกป้องความเป็นส่วนตัวของนักศึกษาเป็นสำคัญสูงสุด:
            </p>
            <div className="bg-surface/50 border border-primary-light/40 rounded-xl p-4 space-y-3 text-xs sm:text-sm text-ink/80">
              <p>
                <strong>ระบบปกปิดข้อมูลของรีวิว:</strong> เมื่อผู้รีวิวระบุตัวเลือก "ไม่ระบุตัวตน" บนโพสต์รีวิว ข้อมูลชื่อและรูปโปรไฟล์จริงของคุณจะไม่ถูกจัดเก็บหรือนำออกมาแสดงผลในแถบข้อมูลรีวิวของหน้าฟีดหลักและหน้าโปรไฟล์แก่ผู้อื่นอย่างเด็ดขาด
              </p>
              <p>
                <strong>ระบบรักษาความปลอดภัยความเป็น Anonymous ในช่องคอมเมนต์:</strong> หากผู้ใช้ที่เป็นผู้เขียนโพสต์รีวิวแบบไม่เปิดเผยตัวตน เข้าไปเขียนคอมเมนต์เพิ่มเติมภายใต้รีวิวดังกล่าว ระบบจะแปลงตัวตนคอมเมนต์เป็น **"รุ่นพี่ไม่ระบุตัวตน"** และแปลงอวาตาร์เป็น **"พี่"** บนฝั่งผู้ใช้งานทันที เพื่อรักษาข้อมูลความลับและป้องกันการเชื่อมโยงความลับอย่างแน่นหนา
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              3. การส่งต่อข้อมูลและการเปิดเผยข้อมูล
            </h2>
            <p>
              เราไม่มีนโยบายในการขาย แลกเปลี่ยน หรือส่งต่อข้อมูลส่วนบุคคลที่สามารถระบุตัวตนได้จริงของผู้ใช้งานไปยังบุคคลที่สาม เว้นแต่จะเป็นการปฏิบัติตามกฎหมายอย่างหลีกเลี่ยงไม่ได้
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              4. คุกกี้ (Cookies)
            </h2>
            <p>
              เรามีการใช้งานคุกกี้เบื้องต้นเพื่ออำนวยความสะดวกในการจัดเก็บสถานะความปลอดภัยและการเข้าสู่ระบบของคุณ เพื่อให้คุณสามารถใช้งานแพลตฟอร์มได้อย่างราบรื่นและมีประสิทธิภาพสูงสุด
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
