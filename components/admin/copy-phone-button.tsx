"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyPhoneButton({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(phone);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      className="inline-flex items-center gap-1 rounded-[6px] border border-slate-200 px-2 py-1"
      type="button"
      onClick={copy}
    >
      <Copy size={14} aria-hidden="true" />
      {copied ? "복사됨" : "복사"}
    </button>
  );
}
