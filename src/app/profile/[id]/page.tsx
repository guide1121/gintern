import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import { PublicProfileContent } from "./PublicProfileContent";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  // ดึงข้อมูลผู้ใช้ปัจจุบัน (ถ้าล็อกอินอยู่) เพื่อใช้เช็คและส่งไปเป็นของตนเอง
  let currentUser = null;
  if (session?.user?.email) {
    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, role: true },
    });

    // หาก id ที่เข้าชมเป็น id ของตัวเอง ให้เปลี่ยนเส้นทางไปยังหน้าโปรไฟล์ของตนเอง
    if (currentUser && currentUser.id === id) {
      redirect("/profile");
    }
  }

  // ดึงข้อมูลโปรไฟล์ของเป้าหมาย
  const targetUser = await prisma.user.findUnique({
    where: { id },
    include: {
      badges: true,
      reviews: {
        where: {
          isAnonymous: false, // ดึงเฉพาะรีวิวที่ไม่ได้เปิด Anonymous
        },
        include: {
          company: true,
          likes: true,
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!targetUser) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={currentUser || undefined} />
      
      <PublicProfileContent 
        targetUser={targetUser} 
        currentUserId={currentUser?.id || null} 
      />

      <Footer />
    </div>
  );
}
