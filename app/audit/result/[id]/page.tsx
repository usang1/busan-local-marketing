import { AlertTriangle, CheckCircle2, ClipboardCheck, SearchCheck } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageEvent } from "@/components/analytics/page-event";
import { LeadForm } from "@/components/forms/lead-form";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getAuditById } from "@/lib/admin/db";
import { runPlaceAudit, type AuditResult, type AuditStatus } from "@/lib/audit/rules";
import { decodeSelfAuditInput, decodeSelfPlaceAuditSnapshot } from "@/lib/audit/shareable";
import type { PlaceAnalysisFinding, PlaceAnalysisResult } from "@/lib/naver-place/types";
import { getPublicSiteProfile } from "@/lib/public/site-config";
import { createPublicMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return createPublicMetadata({
    title: "네이버 플레이스 자동진단 결과",
    description: "사용자가 입력한 네이버 플레이스 상태를 기준으로 기본 개선 포인트를 정리한 임시 자동진단 결과입니다.",
    path: "/audit/result",
    index: false,
  });
}

function statusText(status: AuditStatus) {
  return status === "good" ? "양호" : status === "needs_improvement" ? "개선 필요" : "우선 개선";
}

function statusClass(status: AuditStatus) {
  if (status === "good") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "needs_improvement") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function safeResult(value: Record<string, unknown>): AuditResult {
  return value as unknown as AuditResult;
}

function safePlaceResult(value: Record<string, unknown>): PlaceAnalysisResult | null {
  return value?.mode === "naver_place_url" ? (value as unknown as PlaceAnalysisResult) : null;
}

function formatDateTime(value?: string | null) {
  if (!value) return "확인 불가";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "확인 불가";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function regionFromAddress(address?: string | null) {
  if (!address) return "";
  return address.split(/\s+/).slice(0, 2).join(" ");
}

export default async function AuditResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const selfPlaceSnapshot = decodeSelfPlaceAuditSnapshot(id);
  const selfInput = selfPlaceSnapshot ? null : decodeSelfAuditInput(id);
  const [{ site }, auditResult] = await Promise.all([
    getPublicSiteProfile(),
    selfPlaceSnapshot || selfInput ? Promise.resolve({ data: null, error: null }) : getAuditById(id),
  ]);
  const { data: audit, error } = auditResult;

  if (!audit && !selfPlaceSnapshot && !selfInput && !error) notFound();

  const placeResult = selfPlaceSnapshot?.analysis || (audit ? safePlaceResult(audit.result_data) : null);
  const result = placeResult || (audit ? safeResult(audit.result_data) : selfInput ? runPlaceAudit(selfInput) : null);
  const businessName =
    placeResult?.place.name ||
    audit?.business_name ||
    selfInput?.businessName ||
    (placeResult ? `네이버 플레이스 ${placeResult.place.placeId}` : "");
  const industry = placeResult?.place.category || audit?.industry || selfInput?.industry || "";
  const region = audit?.region || selfInput?.region || regionFromAddress(placeResult?.place.roadAddress || placeResult?.place.address);
  const placeUrl = placeResult?.place.normalizedUrl || audit?.place_url || selfInput?.placeUrl || "";
  const storedAuditId = audit?.id;

  return (
    <>
      <PageEvent eventName={ANALYTICS_EVENTS.VIEW_AUDIT_RESULT} params={{ audit_type: "naver_place_self_input" }} />
      <Breadcrumbs
        items={[
          { name: "무료 진단", href: "/free-audit" },
          { name: "자동진단 결과", href: `/audit/result/${id}` },
        ]}
      />
      <Section className="pt-10 sm:pt-12">
        {error ? (
          <div className="rounded-[8px] border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">{error}</div>
        ) : null}
        {result ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div className="grid gap-6">
              <div className="rounded-[8px] border border-line bg-white p-6 shadow-[0_18px_60px_rgba(31,42,46,0.08)] sm:p-8">
                <p className="inline-flex rounded-[6px] bg-pale-mint px-3 py-1 text-sm font-bold text-accent">
                  Rule Based Auto Audit
                </p>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                  {businessName} 자동진단 결과
                </h1>
                <p className="mt-4 text-base leading-8 text-muted">{result.summary}</p>
                {placeResult ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[8px] bg-ink p-4 text-white">
                      <p className="text-xs font-bold text-white/65">진단 점수</p>
                      <p className="mt-2 text-3xl font-extrabold">{placeResult.score ?? "-"}점</p>
                    </div>
                    <div className="rounded-[8px] bg-pale-mint p-4">
                      <p className="text-xs font-bold text-accent">등급</p>
                      <p className="mt-2 text-3xl font-extrabold text-ink">{placeResult.grade}</p>
                    </div>
                    <div className="rounded-[8px] bg-ivory p-4">
                      <p className="text-xs font-bold text-muted">계산 기준</p>
                      <p className="mt-2 text-lg font-extrabold text-ink">
                        {placeResult.earnedScore}/{placeResult.maxScore}
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 grid gap-3 rounded-[8px] bg-ivory p-5 text-sm leading-7 text-muted sm:grid-cols-2">
                  <p><span className="font-bold text-ink">업종</span> {industry}</p>
                  <p><span className="font-bold text-ink">지역</span> {region}</p>
                  <p><span className="font-bold text-ink">데이터 방식</span> {placeResult ? placeResult.dataSourceLabel : "사용자 입력 기반 이전 진단"}</p>
                  <p><span className="font-bold text-ink">마지막 확인</span> {placeResult ? formatDateTime(placeResult.fetchedAt) : "상담 단계 확인"}</p>
                </div>
              </div>

              {placeResult ? (
                <section className="rounded-[8px] border border-line bg-white p-6">
                  <h2 className="text-xl font-extrabold text-ink">진단 근거 데이터</h2>
                  {placeResult.place.warnings.length ? (
                    <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                      {placeResult.place.warnings.map((warning) => (
                        <p key={warning}>· {warning}</p>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {placeResult.evidence.map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-[8px] border p-4 ${item.available ? "border-line bg-ivory" : "border-slate-200 bg-slate-50 text-muted"}`}
                      >
                        <p className="text-xs font-bold text-muted">{item.label}</p>
                        <p className="mt-2 text-base font-extrabold text-ink">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-[8px] border border-line bg-white p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
                  <CheckCircle2 className="text-accent" size={22} aria-hidden="true" />
                  잘 되어 있는 부분
                </h2>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                  {result.positives.map((item) => (
                    <li key={item} className="rounded-[8px] bg-pale-mint/60 p-4">{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[8px] border border-line bg-white p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
                  <AlertTriangle className="text-amber-600" size={22} aria-hidden="true" />
                  우선 개선할 부분 3개
                </h2>
                <div className="mt-5 grid gap-4">
                  {result.priorityImprovements.length ? result.priorityImprovements.map((item) => (
                    <article key={`${item.area}-${item.label}`} className="rounded-[8px] border border-line bg-ivory p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-[6px] border px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>
                          {statusText(item.status)}
                        </span>
                        <h3 className="text-lg font-bold text-ink">{item.label}</h3>
                      </div>
                      <p className="mt-3 text-sm font-bold text-ink">{item.summary}</p>
                      <p className="mt-3 text-sm leading-7 text-muted">{item.explanation}</p>
                      {(item as PlaceAnalysisFinding).evidence ? (
                        <p className="mt-3 rounded-[6px] bg-white p-3 text-xs font-bold leading-6 text-ink">
                          판별 근거: {(item as PlaceAnalysisFinding).evidence}
                        </p>
                      ) : null}
                      <p className="mt-3 text-sm leading-7 text-accent">{item.recommendation}</p>
                    </article>
                  )) : (
                    <p className="rounded-[8px] bg-ivory p-4 text-sm leading-7 text-muted">
                      공개 정보에서 평가 가능한 항목이 부족해 자동으로 우선순위를 정하지 않았습니다. 상담 단계에서 실제 운영 정보와 함께 확인이 필요합니다.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[8px] border border-line bg-white p-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
                  <SearchCheck className="text-accent" size={22} aria-hidden="true" />
                  추가 확인할 부분
                </h2>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                  {result.additionalChecks.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </section>

              {placeResult?.unavailableChecks.length ? (
                <section className="rounded-[8px] border border-line bg-white p-6">
                  <h2 className="text-xl font-extrabold text-ink">점수에서 제외한 항목</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    네이버 공개 정보에서 확인되지 않은 값은 0점 처리하지 않고 평가 대상에서 제외했습니다.
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm leading-7 text-muted">
                    {placeResult.unavailableChecks.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="rounded-[8px] border border-line bg-white p-6">
                <h2 className="text-xl font-extrabold text-ink">추천 서비스</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {result.recommendedServices.map((service) => (
                    <article key={service.slug} className="rounded-[8px] border border-line bg-ivory p-4">
                      <h3 className="font-bold text-ink">{service.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{service.reason}</p>
                      <Link className="mt-4 inline-flex text-sm font-bold text-accent" href={`/services/${service.slug}`}>
                        서비스 보기
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="sticky top-24 grid gap-5">
              <div className="rounded-[8px] border border-line bg-white p-5">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
                  <ClipboardCheck className="text-accent" size={22} aria-hidden="true" />
                  상세 진단 신청
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  자동진단은 네이버 공개 정보에서 확인 가능한 값만 기준으로 계산합니다. 실제 업종 상황과 운영 의도는 상담 단계에서 함께 확인합니다.
                </p>
                <div className="mt-5 grid gap-3">
                  <ButtonLink
                    href="#audit-consultation"
                    data-analytics-event={ANALYTICS_EVENTS.CLICK_AUDIT_CONSULTATION}
                    data-analytics-location="audit_result_sidebar"
                  >
                    상세 진단 신청하기
                  </ButtonLink>
                  <KakaoCta variant="outline" location="audit_result_sidebar" kakaoChatUrl={site.kakaoChatUrl} />
                </div>
              </div>
              <div className="rounded-[8px] border border-line bg-ivory p-5 text-xs leading-6 text-muted">
                확인되지 않은 네이버 순위, 비공개 리뷰 내용, 경쟁업체 정보는 생성하지 않았습니다. 수집 실패 항목은 점수에서 제외했습니다.
              </div>
            </aside>
          </div>
        ) : null}
      </Section>

      {result ? (
        <Section id="audit-consultation" className="bg-pale-blue/50">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              eyebrow="Lead Gate"
              title="전문가 상세 진단을 요청하세요"
              description="기본 결과를 확인한 뒤 필요한 경우에만 연락처를 남기면 됩니다. 기존 CRM Lead로 저장되고 자동진단 이력과 연결됩니다."
            />
            <LeadForm
              type="free_audit"
              auditId={storedAuditId}
              kakaoChatUrl={site.kakaoChatUrl}
              initialValues={{
                businessName,
                industry,
                region: region || "확인 필요",
                placeUrl,
                concerns: result?.priorityImprovements.map((item) => item.label).join(", ") || "",
                interestedServices: ["네이버 플레이스"],
              }}
            />
          </div>
        </Section>
      ) : null}
    </>
  );
}
