"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { leadStatusOptions, leadTypeOptions } from "@/lib/admin/constants";

export function LeadFilters({ industries, auditOnly = false }: { industries: string[]; auditOnly?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const paramsString = searchParams.toString();
  const params = useMemo(() => new URLSearchParams(paramsString), [paramsString]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(paramsString);
      if (query) next.set("q", query);
      else next.delete("q");
      next.delete("page");
      router.replace(`${pathname}?${next.toString()}`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, paramsString, pathname, router]);

  function update(name: string, value: string) {
    const next = new URLSearchParams(paramsString);
    if (value && value !== "all") next.set(name, value);
    else next.delete(name);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mb-5 grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
      <label className="relative text-sm font-bold text-slate-700">
        검색
        <Search className="absolute bottom-3 left-3 text-slate-400" size={16} aria-hidden="true" />
        <input
          className="mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 pl-9 pr-3 text-base font-normal"
          placeholder="업체명, 담당자명, 연락처"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {!auditOnly ? (
        <label className="text-sm font-bold text-slate-700">
          유형
          <select className="mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 font-normal" value={params.get("type") || "all"} onChange={(event) => update("type", event.target.value)}>
            {leadTypeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      ) : null}
      <label className="text-sm font-bold text-slate-700">
        상태
        <select className="mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 font-normal" value={params.get("status") || "all"} onChange={(event) => update("status", event.target.value)}>
          <option value="all">전체</option>
          {leadStatusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold text-slate-700">
        업종
        <select className="mt-2 min-h-11 w-full rounded-[8px] border border-slate-200 px-3 font-normal" value={params.get("industry") || "all"} onChange={(event) => update("industry", event.target.value)}>
          <option value="all">전체</option>
          {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold text-slate-700">
        지역/정렬
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select className="min-h-11 rounded-[8px] border border-slate-200 px-3 font-normal" value={params.get("region") || "all"} onChange={(event) => update("region", event.target.value)}>
            <option value="all">전체</option>
            <option value="busan">부산</option>
            <option value="gyeongnam">경남</option>
            <option value="other">기타</option>
          </select>
          <select className="min-h-11 rounded-[8px] border border-slate-200 px-3 font-normal" value={params.get("sort") || "newest"} onChange={(event) => update("sort", event.target.value)}>
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="business">업체명</option>
          </select>
        </div>
      </label>
    </div>
  );
}
