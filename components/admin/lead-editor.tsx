"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { leadStatusOptions } from "@/lib/admin/constants";
import type { Lead } from "@/types/database";
import type { LeadStatus } from "@/types/lead";
import { Button } from "@/components/ui/button";

export function LeadEditor({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [adminMemo, setAdminMemo] = useState(lead.admin_memo || "");
  const [isTest, setIsTest] = useState(Boolean(lead.is_test));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminMemo, isTest }),
    });

    setLoading(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "저장하지 못했습니다. 다시 시도해주세요.");
      return;
    }

    setMessage("저장되었습니다.");
    router.refresh();
  }

  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-extrabold text-slate-950">영업 관리</h2>
      <label className="mt-5 block text-sm font-bold text-slate-700">
        Lead 상태
        <select
          className="mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 text-base font-normal"
          value={status}
          onChange={(event) => setStatus(event.target.value as LeadStatus)}
        >
          {leadStatusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 flex items-start gap-2 rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={isTest}
          onChange={(event) => setIsTest(event.target.checked)}
        />
        <span>
          테스트 Lead로 표시
          <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">
            운영 Dashboard 집계에서 실제 영업 데이터와 구분합니다.
          </span>
        </span>
      </label>
      <label className="mt-5 block text-sm font-bold text-slate-700">
        관리자 메모
        <textarea
          className="mt-2 min-h-48 w-full rounded-[8px] border border-slate-200 px-3 py-3 text-base font-normal leading-7"
          value={adminMemo}
          onChange={(event) => setAdminMemo(event.target.value)}
          placeholder="통화 내용, 다음 액션, 제안 범위 등을 기록하세요."
        />
      </label>
      {message ? <p className="mt-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm font-bold text-rose-700">{error}</p> : null}
      <Button type="button" className="mt-5 w-full" onClick={save} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
        저장
      </Button>
    </div>
  );
}
