"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArchiveButton({
  endpoint,
  label = "비공개 처리",
  confirmMessage = "공개 해제하시겠습니까?",
}: {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function archive() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={archive}
      disabled={loading}
      className="rounded-[8px] border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
    >
      {loading ? "처리 중" : label}
    </button>
  );
}
