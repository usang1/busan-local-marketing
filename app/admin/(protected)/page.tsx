import Link from "next/link";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { LeadTable } from "@/components/admin/lead-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { funnelStatuses, leadStatusLabels, orderStatusLabels } from "@/lib/admin/constants";
import { getDashboardStats, type DashboardPeriod } from "@/lib/admin/db";
import { formatDateTime, formatPrice } from "@/lib/admin/format";

const periodOptions: { value: DashboardPeriod; label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "7d", label: "최근 7일" },
  { value: "30d", label: "최근 30일" },
  { value: "all", label: "전체" },
];

function formatRate(value: number | null) {
  return value === null ? "-" : `${value}%`;
}

function behaviorMetric(value: number | null) {
  return value === null ? "GA4 확인" : String(value);
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const period = periodOptions.some((item) => item.value === params.period) ? (params.period as DashboardPeriod) : "30d";
  const stats = await getDashboardStats(period);
  const kpis = [
    ["신규 Lead", stats.newLeads],
    ["무료진단 Lead", stats.freeAudit],
    ["일반 상담 Lead", stats.consultation],
    ["연락완료", stats.contacted],
    ["상담중", stats.consulting],
    ["제안", stats.proposal],
    ["계약", stats.contracted],
    ["결제", stats.paidOrders],
    ["결제금액", formatPrice(stats.paidAmount, "0원")],
    ["테스트 Lead", stats.testLeads],
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="유입, 문의, 상담, 계약, 결제 흐름을 실제 CRM/결제 데이터 기준으로 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((item) => (
              <Link
                key={item.value}
                href={`/admin?period=${item.value}`}
                className={`rounded-[8px] border px-3 py-2 text-sm font-bold ${
                  period === item.value
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        }
      />
      {stats.error ? <AdminError message={stats.error} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <div key={label} className="rounded-[8px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-950">영업 Funnel</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {funnelStatuses.map((status) => (
            <div key={status} className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <StatusBadge status={status} />
              <p className="mt-4 text-2xl font-extrabold text-slate-950">{stats.funnel[status] || 0}</p>
              <p className="mt-1 text-sm text-slate-600">{leadStatusLabels[status]}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-[8px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Conversion</th>
                <th className="px-4 py-3">분모</th>
                <th className="px-4 py-3">전환</th>
                <th className="px-4 py-3">전환율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.conversionSteps.map((step) => (
                <tr key={step.label}>
                  <td className="px-4 py-3 font-bold text-slate-950">{step.label}</td>
                  <td className="px-4 py-3 text-slate-700">{step.from}</td>
                  <td className="px-4 py-3 text-slate-700">{step.to}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRate(step.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-950">무료진단 Funnel</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">CTA 클릭과 Form 시작은 GA4 행동 이벤트, 제출 이후는 CRM 데이터 기준입니다.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["CTA Click", behaviorMetric(stats.freeAuditFunnel.ctaClicks)],
            ["Form Start", behaviorMetric(stats.freeAuditFunnel.formStarts)],
            ["Form Submit", stats.freeAuditFunnel.formSubmits],
            ["Submit Rate", formatRate(stats.freeAuditFunnel.submitRate)],
            ["Contract", stats.freeAuditFunnel.contracts],
            ["Paid", stats.freeAuditFunnel.paid],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
              <p className="mt-3 text-xl font-extrabold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          GA4 이벤트: click_free_audit, start_free_audit_form, submit_free_audit. 개인정보는 Analytics 이벤트 파라미터에서 제외됩니다.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-950">유입 Source 분석</h2>
        </div>
        {stats.sourceStats.length ? (
          <div className="overflow-x-auto rounded-[8px] border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Medium</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Referrer</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">무료 진단</th>
                  <th className="px-4 py-3">일반 상담</th>
                  <th className="px-4 py-3">계약</th>
                  <th className="px-4 py-3">결제</th>
                  <th className="px-4 py-3">매출</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.sourceStats.map((source) => (
                  <tr key={source.key}>
                    <td className="px-4 py-3 font-bold text-slate-950">{source.source}</td>
                    <td className="px-4 py-3 text-slate-700">{source.medium || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{source.campaign || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{source.referrer || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{source.leads}</td>
                    <td className="px-4 py-3 text-slate-700">{source.freeAudit}</td>
                    <td className="px-4 py-3 text-slate-700">{source.consultation}</td>
                    <td className="px-4 py-3 text-slate-700">{source.contracts}</td>
                    <td className="px-4 py-3 text-slate-700">{source.payments}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPrice(source.revenue, "0원")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="유입 데이터 없음" description="선택한 기간에 저장된 문의 또는 결제 유입 데이터가 없습니다." />
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-950">Campaign 분석</h2>
        </div>
        {stats.campaignStats.length ? (
          <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">방문/Session</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">계약</th>
                  <th className="px-4 py-3">결제</th>
                  <th className="px-4 py-3">매출</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.campaignStats.map((campaign) => (
                  <tr key={campaign.campaign}>
                    <td className="px-4 py-3 font-bold text-slate-950">{campaign.campaign}</td>
                    <td className="px-4 py-3 text-slate-700">GA4 별도</td>
                    <td className="px-4 py-3 text-slate-700">{campaign.leads}</td>
                    <td className="px-4 py-3 text-slate-700">{campaign.contracts}</td>
                    <td className="px-4 py-3 text-slate-700">{campaign.payments}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPrice(campaign.revenue, "0원")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Campaign 데이터 없음" description="선택한 기간에 Campaign 값이 있는 문의 또는 결제가 없습니다." />
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-950">최근 결제</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-accent">주문 보기</Link>
        </div>
        {stats.recentOrders.length ? (
          <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      <Link href={`/admin/orders/${order.id}`}>{order.order_id}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{order.business_name}</td>
                    <td className="px-4 py-3 text-slate-700">{order.products?.name || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPrice(order.amount, "")}</td>
                    <td className="px-4 py-3 text-slate-700">{orderStatusLabels[order.status]}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="최근 결제 없음" description="아직 결제 완료된 주문이 없습니다." />
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-950">최근 문의</h2>
          <Link href="/admin/leads" className="text-sm font-bold text-accent">전체 보기</Link>
        </div>
        {stats.recent.length ? (
          <LeadTable leads={stats.recent} />
        ) : (
          <EmptyState title="문의 없음" description="아직 접수된 문의가 없습니다." />
        )}
      </section>
    </>
  );
}
