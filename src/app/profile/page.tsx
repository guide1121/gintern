import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/db";
import { ProfileContent } from "./ProfileContent";
import { Footer } from "@/components/Footer";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user || !session.user.email) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      badges: true,
      reviews: {
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
      likes: {
        include: {
          review: {
            include: {
              company: true,
              user: true,
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
          },
        },
      },
    },
  });

  if (!dbUser) redirect("/login");

  if (!dbUser.role) redirect("/register/role");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={dbUser} />
      
      <ProfileContent dbUser={dbUser} />

      <Footer />
    </div>
  );
}
