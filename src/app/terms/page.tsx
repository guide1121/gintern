import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import { ShieldCheck, Scale, FileText } from "lucide-react";

export default async function TermsPage() {
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
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-ink" data-font="ui">ข้อกำหนดการใช้งาน</h1>
          <p className="text-muted text-sm mt-2">ปรับปรุงล่าสุดเมื่อ 21 มิถุนายน 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-ink/90">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              <FileText className="w-5 h-5 text-primary" />
              1. การยอมรับข้อตกลง
            </h2>
            <p>
              ยินดีต้อนรับสู่ GIntern แพลตฟอร์มแบ่งปันประสบการณ์รีวิวฝึกงานและทำงาน การเข้าใช้งานหรือสมัครสมาชิกแพลตฟอร์มของเรา หมายความว่าคุณยอมรับที่จะปฏิบัติตามเงื่อนไขและข้อกำหนดเหล่านี้ทุกประการ
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              <ShieldCheck className="w-5 h-5 text-primary" />
              2. กฎการเขียนรีวิวและการแสดงความคิดเห็น
            </h2>
            <p>
              เพื่อให้พื้นที่นี้เป็นประโยชน์ ปลอดภัย และสร้างสรรค์ต่อรุ่นน้องและสังคมการศึกษา ผู้ใช้ตกลงที่จะปฏิบัติตามกติกาดังต่อไปนี้:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-muted">
              <li>เขียนข้อมูลจากประสบการณ์จริงของตนเองเท่านั้น ไม่ผ่านการจ้างวานหรือบิดเบือนข้อมูล</li>
              <li>ไม่เผยแพร่ความลับทางการค้า รหัสผ่านภายใน หรือข้อมูลอื่นใดที่ขัดต่อสัญญาปกปิดความลับ (NDA) ของบริษัท</li>
              <li>หลีกเลี่ยงการใช้ถ้อยคำหยาบคาย การโจมตีบุคคล หรือการแสดงความคิดเห็นที่แสดงความเกลียดชัง (Hate Speech)</li>
              <li>ห้ามนำข้อมูลหรือช่องทางติดต่อส่วนตัวของบุคคลอื่นมาเปิดเผยโดยไม่ได้รับอนุญาต</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              <Scale className="w-5 h-5 text-primary" />
              3. สิทธิ์การเป็นเจ้าของและการใช้ข้อมูล
            </h2>
            <p>
              เนื้อหาการรีวิวที่ผู้ใช้เขียนขึ้นถือเป็นความคิดเห็นส่วนบุคคลของผู้เขียน GIntern เป็นเพียงสื่อกลางในการเผยแพร่ และขอสงวนสิทธิ์ในการแก้ไข ปรับปรุง หรือนำออกซึ่งความคิดเห็นที่ไม่ถูกต้อง เหมาะสม หรือขัดต่อข้อกำหนดของเรา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2" data-font="ui">
              4. การจำกัดความรับผิดชอบ
            </h2>
            <p>
              ข้อมูลและรีวิวทั้งหมดบน GIntern มีขึ้นเพื่อวัตถุประสงค์ในการแนะนำและแบ่งปันเท่านั้น เราไม่รับประกันความถูกต้องแม่นยำ 100% หรือความเหมาะสมในทุกสถานการณ์ของข้อมูล ผู้ใช้ควรใช้วิจารณญาณประกอบการตัดสินใจของตนเอง
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
