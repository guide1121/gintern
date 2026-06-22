import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/db";
import { EditProfileForm } from "./EditProfileForm";
import Image from "next/image";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user || !session.user.email) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      workPlace: true,
      studyPlace: true,
      fieldOfStudy: true,
      bio: true,
      role: true,
      instagram: true,
      facebook: true,
    },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={session.user} />

      <EditProfileForm user={dbUser} />

      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="GIntern" width={24} height={24} className="w-6 h-6 opacity-60" />
            <span data-font="ui">GIntern</span>
          </div>
          <div className="flex gap-6" data-font="ui">
            <a href="#" className="hover:text-ink transition-colors duration-150">ข้อกำหนดการใช้งาน</a>
            <a href="#" className="hover:text-ink transition-colors duration-150">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-ink transition-colors duration-150">ติดต่อ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
