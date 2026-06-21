import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoleSelectionForm } from "./RoleSelectionForm";
import Image from "next/image";

export default async function RegisterRolePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2">
          <Image src="/logo.png" alt="GIntern" width={48} height={48} className="w-12 h-12" />
          <span className="text-2xl font-medium text-ink" data-font="ui">GIntern</span>
        </div>
      </div>

      <RoleSelectionForm />
    </div>
  );
}
