import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { LeadFilters } from "@/components/admin/lead-filters";
import { LeadTable } from "@/components/admin/lead-table";
import { getLeadIndustries, listLeads } from "@/lib/admin/db";
import type { LeadStatus } from "@/types/lead";

export default async function AdminAuditsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [industries, result] = await Promise.all([
    getLeadIndustries(),
    listLeads({
      page: Number(params.page || 1),
      q: params.q,
      type: "free_audit",
      status: (params.status as LeadStatus) || "all",
      region: (params.region as "all" | "busan" | "gyeongnam" | "other") || "all",
      industry: params.industry,
      sort: (params.sort as "newest" | "oldest" | "business") || "newest",
    }),
  ]);

  return (
    <>
      <AdminPageHeader title="무료 진단" description="네이버 플레이스 진단 신청만 빠르게 확인합니다." />
      <LeadFilters industries={industries} auditOnly />
      {result.error ? <AdminError message={result.error} /> : null}
      {result.data.length ? <LeadTable leads={result.data} /> : <EmptyState title="무료 진단 없음" description="아직 접수된 무료 진단 신청이 없습니다." />}
    </>
  );
}
