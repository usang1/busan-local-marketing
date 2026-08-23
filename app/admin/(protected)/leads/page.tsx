import Link from "next/link";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { LeadFilters } from "@/components/admin/lead-filters";
import { LeadTable } from "@/components/admin/lead-table";
import { listLeads, getLeadIndustries } from "@/lib/admin/db";
import type { LeadStatus, LeadType } from "@/types/lead";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const [industries, result] = await Promise.all([
    getLeadIndustries(),
    listLeads({
      page,
      q: params.q,
      type: (params.type as LeadType) || "all",
      status: (params.status as LeadStatus) || "all",
      region: (params.region as "all" | "busan" | "gyeongnam" | "other") || "all",
      industry: params.industry,
      sort: (params.sort as "newest" | "oldest" | "business") || "newest",
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.count / result.pageSize));
  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") next.set(key, value);
    });
    next.set("page", String(nextPage));
    return `?${next.toString()}`;
  };

  return (
    <>
      <AdminPageHeader title="전체 문의" description="무료 진단과 일반 상담을 함께 관리합니다." />
      <LeadFilters industries={industries} />
      {result.error ? <AdminError message={result.error} /> : null}
      {result.data.length ? (
        <>
          <LeadTable leads={result.data} />
          <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
            <span>총 {result.count}건 · {result.page}/{totalPages}페이지</span>
            <div className="flex gap-2">
              {result.page > 1 ? <Link className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 font-bold" href={pageHref(result.page - 1)}>이전</Link> : null}
              {result.page < totalPages ? <Link className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 font-bold" href={pageHref(result.page + 1)}>다음</Link> : null}
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="문의 없음" description="조건에 맞는 문의가 없습니다." />
      )}
    </>
  );
}
