import { ExternalLink, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminError, AdminPageHeader } from "@/components/admin/admin-page";
import { CopyPhoneButton } from "@/components/admin/copy-phone-button";
import { LeadEditor } from "@/components/admin/lead-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { leadTypeLabels } from "@/lib/admin/constants";
import { formatDateTime, isSafeHttpUrl } from "@/lib/admin/format";
import { getLead } from "@/lib/admin/db";

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
  const { data: lead, error } = await getLead(id);

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
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <InfoRow label="신청일" value={formatDateTime(lead.created_at)} />
                <InfoRow label="마지막 수정일" value={formatDateTime(lead.updated_at)} />
              </dl>
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
