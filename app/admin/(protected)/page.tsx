import Link from "next/link";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { LeadTable } from "@/components/admin/lead-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { funnelStatuses, leadStatusLabels, orderStatusLabels } from "@/lib/admin/constants";
import { getDashboardStats } from "@/lib/admin/db";
import { formatDateTime, formatPrice } from "@/lib/admin/format";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const kpis = [
    ["전체 Lead", stats.total],
    ["오늘 신규 Lead", stats.today],
    ["이번 주 신규 Lead", stats.week],
    ["무료 진단 신청", stats.freeAudit],
    ["일반 상담 신청", stats.consultation],
    ["상담 진행 중", stats.consulting],
    ["제안 발송", stats.proposal],
    ["계약 완료", stats.contracted],
    ["결제 완료 건", stats.paidOrders],
    ["결제 완료 금액", formatPrice(stats.paidAmount, "0원")],
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="무료 진단과 상담 문의의 현재 영업 상태를 확인합니다." />
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
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-950">최근 30일 유입 Source</h2>
        </div>
        {stats.sourceStats.length ? (
          <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">전체 Lead</th>
                  <th className="px-4 py-3">무료 진단</th>
                  <th className="px-4 py-3">일반 상담</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.sourceStats.map((source) => (
                  <tr key={source.source}>
                    <td className="px-4 py-3 font-bold text-slate-950">{source.source}</td>
                    <td className="px-4 py-3 text-slate-700">{source.total}</td>
                    <td className="px-4 py-3 text-slate-700">{source.freeAudit}</td>
                    <td className="px-4 py-3 text-slate-700">{source.consultation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="유입 데이터 없음" description="최근 30일 내 UTM이 저장된 문의가 없습니다." />
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
