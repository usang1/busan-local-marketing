import { ExternalLink, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminError, AdminPageHeader } from "@/components/admin/admin-page";
import { CopyPhoneButton } from "@/components/admin/copy-phone-button";
import { LeadEditor } from "@/components/admin/lead-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { leadTypeLabels } from "@/lib/admin/constants";
import { formatDateTime, formatPrice, isSafeHttpUrl } from "@/lib/admin/format";
import { getLead, getLeadAudit, getLeadOrders } from "@/lib/admin/db";
import type { AuditResult } from "@/lib/audit/rules";
import type { PlaceAnalysisResult } from "@/lib/naver-place/types";

type AdminAuditResult = AuditResult & Partial<Pick<PlaceAnalysisResult, "score" | "grade">>;

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-900">{value || "-"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ data: lead, error }, ordersResult, auditResult] = await Promise.all([getLead(id), getLeadOrders(id), getLeadAudit(id)]);
  const paidOrders = ordersResult.data.filter((order) => order.status === "paid");
  const auditAnalysis = auditResult.data?.result_data as unknown as AdminAuditResult | undefined;
  const auditInput = auditResult.data?.input_data as { placeId?: string; mode?: string } | undefined;
  const firstPaidAt = paidOrders
    .map((order) => order.paid_at)
    .filter(Boolean)
    .sort()[0];

  if (!lead && !error) notFound();

  return (
    <>
      <AdminPageHeader title={lead?.business_name || "Lead 상세"} description="고객 정보와 영업 진행 상태를 관리합니다." />
      {error ? <AdminError message={error} /> : null}
      {lead ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-5">
            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-[6px] bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{leadTypeLabels[lead.lead_type]}</span>
                <StatusBadge status={lead.status} />
                {lead.is_test ? <span className="rounded-[6px] bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">테스트 Lead</span> : null}
              </div>
              <h2 className="text-lg font-extrabold text-slate-950">기본 정보</h2>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow label="업체명" value={lead.business_name} />
                <InfoRow label="담당자" value={lead.contact_name} />
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-500">연락처</dt>
                  <dd className="mt-2 flex flex-wrap gap-2 text-sm">
                    <a className="inline-flex items-center gap-1 rounded-[6px] border border-slate-200 px-2 py-1" href={`tel:${lead.phone}`}>
                      <Phone size={14} aria-hidden="true" />
                      {lead.phone}
                    </a>
                    <CopyPhoneButton phone={lead.phone} />
                  </dd>
                </div>
                <InfoRow label="업종" value={lead.industry} />
                <InfoRow label="지역" value={lead.region} />
              </dl>
            </section>

            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-extrabold text-slate-950">마케팅 정보</h2>
              <dl className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-500">네이버 플레이스 URL</dt>
                  <dd className="mt-2 text-sm">
                    {isSafeHttpUrl(lead.place_url) ? (
                      <a className="inline-flex items-center gap-1 font-bold text-accent" href={lead.place_url || "#"} target="_blank" rel="noreferrer">
                        플레이스 열기
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-slate-600">{lead.place_url || "-"}</span>
                    )}
                  </dd>
                </div>
                <InfoRow label="현재 광고 여부" value={lead.current_marketing} />
                <InfoRow label="월 예산" value={lead.budget} />
                <InfoRow label="관심 서비스" value={lead.interested_services} />
                <InfoRow label="경쟁업체/참고 매장" value={lead.competitor} />
                <InfoRow label="상담 가능 시간" value={lead.preferred_contact_time} />
                <InfoRow label="가장 큰 고민" value={lead.concerns} />
                <InfoRow label="기타 문의" value={lead.message} />
              </dl>
            </section>

            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-extrabold text-slate-950">접수 기록</h2>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow label="Lead 생성일" value={formatDateTime(lead.created_at)} />
                <InfoRow label="최초 연락일" value={formatDateTime(lead.contacted_at)} />
                <InfoRow label="상담일" value={formatDateTime(lead.consulted_at)} />
                <InfoRow label="제안일" value={formatDateTime(lead.proposed_at)} />
                <InfoRow label="계약일" value={formatDateTime(lead.contracted_at)} />
                <InfoRow label="결제일" value={formatDateTime(firstPaidAt)} />
                <InfoRow label="마지막 수정일" value={formatDateTime(lead.updated_at)} />
              </dl>
            </section>

            {ordersResult.error ? <AdminError message={ordersResult.error} /> : null}
            {auditResult.error ? <AdminError message={auditResult.error} /> : null}
            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-extrabold text-slate-950">자동진단 결과</h2>
              {auditResult.data ? (
                <div className="mt-5 grid gap-5">
                  <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoRow label="진단 실시 여부" value="실시" />
                    <InfoRow label="진단일" value={formatDateTime(auditResult.data.created_at)} />
                    <InfoRow label="상담 전환 여부" value={auditResult.data.lead_id ? "전환됨" : "미전환"} />
                    <InfoRow label="입력 업체명" value={auditResult.data.business_name} />
                    <InfoRow label="입력 업종" value={auditResult.data.industry} />
                    <InfoRow label="입력 지역" value={auditResult.data.region} />
                    <InfoRow label="Place ID" value={auditResult.data.place_id || auditInput?.placeId || "-"} />
                    <InfoRow label="자동진단 점수" value={auditAnalysis?.score !== undefined && auditAnalysis.score !== null ? `${auditAnalysis.score}점` : "-"} />
                    <InfoRow label="자동진단 등급" value={auditAnalysis?.grade || "-"} />
                  </dl>
                  <div className="rounded-[8px] bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">핵심 결과</p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">
                      {auditAnalysis?.summary || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">우선 개선사항</p>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                      {(auditAnalysis?.priorityImprovements || []).map((item) => (
                        <li key={`${item.area}-${item.label}`}>· {item.label}: {item.summary}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">이 Lead와 연결된 자동진단 이력이 없습니다.</p>
              )}
            </section>

            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-extrabold text-slate-950">연결 주문 / 매출</h2>
              {ordersResult.data.length ? (
                <div className="mt-5 overflow-hidden rounded-[8px] border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">주문번호</th>
                        <th className="px-4 py-3">상품</th>
                        <th className="px-4 py-3">상태</th>
                        <th className="px-4 py-3">금액</th>
                        <th className="px-4 py-3">결제일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ordersResult.data.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 font-bold text-slate-950">{order.order_id}</td>
                          <td className="px-4 py-3 text-slate-700">{order.products?.name || "-"}</td>
                          <td className="px-4 py-3 text-slate-700">{order.status}</td>
                          <td className="px-4 py-3 text-slate-700">{formatPrice(order.amount, "")}</td>
                          <td className="px-4 py-3 text-slate-700">{formatDateTime(order.paid_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">아직 이 Lead와 연결된 주문이 없습니다.</p>
              )}
            </section>

            <section className="rounded-[8px] border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-extrabold text-slate-950">유입 정보</h2>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow label="Source" value={lead.utm_source || "직접 유입 / 확인 불가"} />
                <InfoRow label="Medium" value={lead.utm_medium || "확인 불가"} />
                <InfoRow label="Campaign" value={lead.utm_campaign || "확인 불가"} />
                <InfoRow label="Content" value={lead.utm_content || "확인 불가"} />
                <InfoRow label="Term" value={lead.utm_term || "확인 불가"} />
                <InfoRow label="Landing Page" value={lead.landing_page || "확인 불가"} />
                <InfoRow label="Referrer" value={lead.referrer || "확인 불가"} />
              </dl>
            </section>
          </div>

          <LeadEditor lead={lead} />
        </div>
      ) : null}
    </>
  );
}
