import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { ReviewFeed } from "@/components/ReviewFeed";
import { prisma } from "@/lib/db";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ค้นหารีวิวฝึกงาน — GIntern",
  description: "ค้นหาและเปรียบเทียบรีวิวที่ฝึกงานจากรุ่นพี่ตัวจริง คัดกรองตามตำแหน่งงาน บริษัท เบี้ยเลี้ยง และประเภทธุรกิจ",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  let currentUser = session?.user;

  if (session?.user && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, role: true, showBadges: true },
    });
    if (dbUser) {
      currentUser = {
        ...session.user,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
        showBadges: dbUser.showBadges,
      };
    }
  }

  // ดึงข้อมูลรีวิวทั้งหมดจากฐานข้อมูลจริง
  const dbReviews = await prisma.review.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
          logo: true,
        },
      },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          badges: true,
          showBadges: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ถอดค่าค้นหาจาก searchParams (Next.js 15 Async API)
  const resolvedSearchParams = await searchParams;
  const initialSearch = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";

  return (
    <>
      <Navbar user={currentUser} />
      <div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)]">
        <ReviewFeed 
          user={currentUser} 
          dbReviews={dbReviews} 
          initialSearch={initialSearch} 
        />
      </div>
      <Footer />
    </>
  );
}
