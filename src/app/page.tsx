import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HomeClient } from "@/components/HomeClient";
import { prisma } from "@/lib/db";
import { Footer } from "@/components/Footer";
import { unstable_cache } from "next/cache";

const getRecentReviews = unstable_cache(
  async () => {
    return prisma.review.findMany({
      take: 4,
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
  },
  ["recent-reviews"],
  {
    revalidate: 60, // แคชข้อมูลเป็นเวลา 60 วินาที
    tags: ["recent-reviews"],
  }
);

export default async function Home() {
  const session = await auth();
  let currentUser = session?.user;

  if (session?.user && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, role: true, showBadges: true },
    });
    if (dbUser) {
      if (!dbUser.role) {
        redirect("/register/role");
      }
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

  // ดึงข้อมูลรีวิวล่าสุด 4 รายการ จากแคช
  const dbReviews = await getRecentReviews();

  return (
    <>
      <Navbar user={currentUser} />
      <div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] bg-[--bg]">
        <HomeClient user={currentUser} recentReviews={dbReviews} />
      </div>
      <Footer />
    </>
  );
}
