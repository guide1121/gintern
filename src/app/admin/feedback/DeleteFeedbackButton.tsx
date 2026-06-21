"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteFeedback } from "@/app/actions/feedback";

export function DeleteFeedbackButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("คุณต้องการลบความคิดเห็น/ข้อเสนอแนะนี้ใช่หรือไม่?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteFeedback(id);
    setIsDeleting(false);

    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
      aria-label="ลบข้อความติดต่อ"
    >
      {isDeleting ? (
        <span className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      ) : (
        <Trash2 className="w-4.5 h-4.5" />
      )}
    </button>
  );
}
