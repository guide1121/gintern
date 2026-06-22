import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ShieldCheck, Search, MessageSquare, ArrowRight, HeartHandshake, Users, Sparkles, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา — GIntern",
  description: "มารู้จักกับ GIntern แพลตฟอร์มแบ่งปันประสบการณ์รีวิวฝึกงานที่ปลอดภัยที่สุดสำหรับนักศึกษาไทย",
};

export default async function AboutPage() {
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
    <>
      <Navbar user={currentUser} />
      
      <main className="flex-1 w-full bg-[--bg]">
        {/* Hero Section */}
        <section className="bg-primary-light py-20 sm:py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span 
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-primary-ink shadow-sm mb-4" 
              data-font="ui"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" /> รู้จักกับพวกเรา
            </span>
            <h1 
              className="text-4xl sm:text-5xl font-bold text-ink mb-6" 
              style={{ letterSpacing: "-0.02em", textWrap: "balance" }}
              data-font="ui"
            >
              พื้นที่ปลอดภัยเพื่อความโปร่งใสในสังคมฝึกงาน
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              GIntern ก่อตั้งขึ้นจากความมุ่งมั่นที่อยากช่วยให้เพื่อนๆ และน้องๆ นักศึกษาไทยทุกคน 
              สามารถค้นหาและแชร์ประสบการณ์ฝึกงานจริงได้อย่างไม่มีการบิดเบือน เพื่อก้าวไปสู่เส้นทางอาชีพที่เหมาะสมที่สุด
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/search" 
                className="bg-primary text-primary-ink px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-200 min-h-[44px] flex items-center gap-1.5"
                data-font="ui"
              >
                <span>ค้นหารีวิวฝึกงาน</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href={currentUser ? "/review/new" : "/login"} 
                className="bg-white text-ink border border-border px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors min-h-[44px] flex items-center"
                data-font="ui"
              >
                แชร์ประสบการณ์ของคุณ
              </Link>
            </div>
          </div>
        </section>

        {/* Vision & Concept */}
        <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-ink mb-6" 
                style={{ textWrap: "balance" }}
                data-font="ui"
              >
                ทำไมต้องเป็น GIntern?
              </h2>
              <div className="space-y-6 text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  ในช่วงเวลาของการเตรียมตัวฝึกงาน นักศึกษาจำนวนมากมักประสบปัญหา <strong>"ความไม่รู้"</strong> ว่าบริษัทที่ตนเองกำลังจะเลือกเข้าไปทำงานนั้นมีสภาพแวดล้อมที่แท้จริงอย่างไร พี่เลี้ยงใส่ใจแค่ไหน ปริมาณงานเป็นอย่างไร หรือแม้แต่เรื่องสิทธิพื้นฐานอย่างเบี้ยเลี้ยงฝึกงาน
                </p>
                <p>
                  ข้อมูลตามอินเทอร์เน็ตมักเป็นเพียงการประชาสัมพันธ์ผ่านบริษัท หรือบางครั้งก็กระจัดกระจายจนค้นหาได้ยาก 
                  พวกเราจึงริเริ่มรวบรวมรีวิวเหล่านี้มาอยู่ในแพลตฟอร์มเดียวที่ใช้งานง่าย มีการจัดระบบ ค้นหา และกรองข้อมูลได้อย่างอิสระ
                </p>
                <p>
                  สิ่งสำคัญที่สุดคือ ทุกประสบการณ์ที่แชร์บน GIntern มาจาก **"รุ่นพี่ตัวจริง"** ที่ต้องการส่งต่อน้ำใจและเกราะป้องกันให้แก่รุ่นน้อง เพื่อให้การตัดสินใจครั้งสำคัญครั้งนี้ตอบโจทย์ที่สุด
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-surface rounded-2xl p-6 border border-border/60 shadow-md flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1.5" data-font="ui">สร้างคอมมูนิตี้ช่วยเหลือ</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    ขับเคลื่อนโดยพลังของนักศึกษาเพื่อนักศึกษา ส่งต่อวัฒนธรรมการแบ่งปันที่ไม่หวังผลตอบแทนเชิงธุรกิจ
                  </p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border/60 shadow-md flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1.5" data-font="ui">เข้าถึงง่ายและเป็นมิตร</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    ระบบการค้นหาและรีวิวที่ถูกออกแบบมาให้ตอบโจทย์พฤติกรรมการใช้งานจริงของคนรุ่นใหม่
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="bg-surface/30 border-y border-border/60 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink" data-font="ui">ฟีเจอร์หลักที่เราให้ความสำคัญ</h2>
              <p className="text-muted text-sm mt-3">
                เราตั้งใจรังสรรค์ฟังก์ชันเหล่านี้ขึ้นมาเพื่อลดช่องว่างข้อมูลการฝึกงานให้สมบูรณ์แบบที่สุด
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-3" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    ระบบเปิดโอกาสให้รุ่นพี่เลือกปกปิดตัวตนได้ 100% พร้อม Anonymous Comment Guard ที่ซ่อนบัญชีผู้ตอบโดยอัตโนมัติ ทำให้รีวิวประสบการณ์จริงได้อย่างโปร่งใสโดยไม่ต้องกังวลผลกระทบย้อนหลัง
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-3" data-font="ui">ค้นหาข้อมูลเจาะลึก</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    เจาะลึกทุกประเด็นตั้งแต่เรตติ้งคะแนนผู้ดูแล (Mentor) การเรียนรู้จริง (Learning) สภาพแวดล้อมวัฒนธรรม ตลอดจนข้อมูลเฉลี่ยเบี้ยเลี้ยงรายเดือนที่ถูกต้องตามความเป็นจริง
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-light/50 text-primary-ink flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-3" data-font="ui">พูดคุยถามตอบโดยตรง</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    รุ่นน้องสามารถเข้ามากดหัวใจ คอมเมนต์ เพื่อซักถามรายละเอียดเกี่ยวกับประสบการณ์นั้นๆ เพิ่มเติมได้ทันที ช่วยแก้ข้อสงสัยที่ไม่มีเขียนไว้ในใบสมัครงานทั่วไป
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink flex items-center justify-center gap-2" data-font="ui">
              <HelpCircle className="w-7 h-7 text-primary" /> คำถามที่พบบ่อย (FAQs)
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm">
              <h3 className="font-bold text-ink mb-2" data-font="ui">1. ถ้าเลือกเขียนรีวิวแบบ Anonymous บริษัทจะรู้ไหมว่าเป็นเรา?</h3>
              <p className="text-muted text-sm leading-relaxed">
                ระบบจะซ่อนข้อมูลโปรไฟล์และข้อมูลส่วนตัวของคุณทั้งหมด และเปิดเผยเฉพาะเนื้อหารีวิวเท่านั้น อย่างไรก็ดี เพื่อความปลอดภัยสูงสุด แนะนำให้หลีกเลี่ยงการเขียนเล่าสถานการณ์ส่วนตัวที่ชี้เฉพาะเจาะจงมากเกินไปจนเดาตัวบุคคลได้ง่าย
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm">
              <h3 className="font-bold text-ink mb-2" data-font="ui">2. จำเป็นต้องลงทะเบียนเข้าใช้งานเพื่ออ่านรีวิวหรือไม่?</h3>
              <p className="text-muted text-sm leading-relaxed">
                ไม่จำเป็นครับ ผู้เยี่ยมชมทั่วไปทุกคนสามารถค้นหาและอ่านรีวิวฝึกงานบนเว็บไซต์ได้ฟรี 100% แต่หากต้องการกดไลก์ เขียนรีวิวของตนเอง หรือเข้าไปพิมพ์คอมเมนต์ถามตอบ จะต้องลงชื่อเข้าใช้เพื่อความปลอดภัยของระบบ
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm">
              <h3 className="font-bold text-ink mb-2" data-font="ui">3. ข้อมูลรีวิวฝึกงานผ่านการคัดกรองอย่างไร?</h3>
              <p className="text-muted text-sm leading-relaxed">
                เรามีทีมแอดมินคอยตรวจสอบเนื้อหารีวิวที่ไม่เหมาะสม คำหยาบคาย หรือเจตนาทำลายชื่อเสียงที่ปราศจากความจริง นอกจากนี้ยังเปิดโอกาสให้ผู้ใช้งานกด Report ส่ง Feedback รีวิวที่คิดว่ามีข้อมูลบิดเบือนได้อีกด้วย
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
