import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ReviewFeed } from "@/components/ReviewFeed";
import { prisma } from "@/lib/db";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const session = await auth();
  let currentUser = session?.user;

  if (session?.user && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, role: true },
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Navbar user={currentUser} />
      <ReviewFeed user={currentUser} dbReviews={dbReviews} />
      <Footer />
    </>
  );
}
