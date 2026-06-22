import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/ContactForm";
import { MessageSquare } from "lucide-react";

export default async function ContactPage() {
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
      
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-primary-light/50 text-primary-ink mb-3">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-ink" data-font="ui">ติดต่อเรา</h1>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">
            หากคุณมีข้อเสนอแนะ รายงานบั๊ก หรือต้องการร่วมเป็นพันธมิตรกับเรา สามารถส่งข้อความหาทีมงานได้ทันที
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-lg font-bold text-ink mb-4" data-font="ui">ส่งข้อความถึงทีมงาน GIntern</h2>
          <ContactForm initialUser={currentUser ? { name: currentUser.name, email: currentUser.email } : undefined} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
