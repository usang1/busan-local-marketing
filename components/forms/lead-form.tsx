"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SuccessState } from "@/components/forms/success-state";
import { leadSchema, type LeadFormValues } from "@/lib/validations";
import type { LeadType } from "@/types/lead";
import { cn } from "@/lib/utils";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import { getStoredAttribution } from "@/lib/analytics/utm";

const services = [
  "네이버 플레이스",
  "블로그 마케팅",
  "숏폼 콘텐츠",
  "중국 관광객 마케팅",
  "전환 최적화",
];

const inputClass =
  "mt-2 min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-base text-ink transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-medium text-red-700">{message}</p>;
}

export function LeadForm({ type }: { type: LeadType }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [started, setStarted] = useState(false);
  const formStartedAt = useMemo(() => new Date().toISOString(), []);
  const attribution = useMemo(() => getStoredAttribution(), []);
  const isAudit = type === "free_audit";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      leadType: type,
      businessName: "",
      contactName: "",
      phone: "",
      industry: "",
      region: "",
      placeUrl: "",
      budget: "",
      currentMarketing: "",
      concerns: "",
      interestedServices: [],
      competitor: "",
      preferredContactTime: "",
      message: "",
      ...attribution,
      privacyConsent: false,
      companyWebsite: "",
      formStartedAt,
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setServerError("");

    if (isAudit && !values.placeUrl) {
      setError("placeUrl", { message: "네이버 플레이스 URL을 입력해주세요." });
      return;
    }

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setServerError(body?.message || "접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSuccess(true);
    trackEvent(isAudit ? ANALYTICS_EVENTS.SUBMIT_FREE_AUDIT : ANALYTICS_EVENTS.SUBMIT_CONTACT, {
      lead_type: type,
      industry: values.industry,
      region: values.region,
    });
  }

  function handleFirstInput() {
    if (started) return;
    setStarted(true);
    trackEvent(isAudit ? ANALYTICS_EVENTS.START_FREE_AUDIT_FORM : ANALYTICS_EVENTS.START_CONTACT_FORM, {
      lead_type: type,
    });
  }

  if (success) {
    return <SuccessState type={type} />;
  }

  return (
    <form
      className="rounded-[8px] border border-line bg-white p-5 shadow-[0_18px_60px_rgba(31,42,46,0.08)] sm:p-7"
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFirstInput}
      noValidate
    >
      <input type="hidden" {...register("leadType")} value={type} />
      <input type="hidden" {...register("formStartedAt")} value={formStartedAt} />
      <input type="hidden" {...register("utmSource")} />
      <input type="hidden" {...register("utmMedium")} />
      <input type="hidden" {...register("utmCampaign")} />
      <input type="hidden" {...register("utmContent")} />
      <input type="hidden" {...register("utmTerm")} />
      <input type="hidden" {...register("landingPage")} />
      <input type="hidden" {...register("referrer")} />
      <div className="hidden" aria-hidden="true">
        <label>
          회사 웹사이트
          <input tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-ink">
          업체명 <span className="text-accent">*</span>
          <input className={inputClass} placeholder="예: 부산 서면 음식점" autoComplete="organization" {...register("businessName")} />
          <FieldError message={errors.businessName?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          담당자명 <span className="text-accent">*</span>
          <input className={inputClass} placeholder="예: 김대표" autoComplete="name" {...register("contactName")} />
          <FieldError message={errors.contactName?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          연락처 <span className="text-accent">*</span>
          <input className={inputClass} inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          업종 <span className="text-accent">*</span>
          <input className={inputClass} placeholder="예: 음식점, 병원, 카페" {...register("industry")} />
          <FieldError message={errors.industry?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          지역 <span className="text-accent">*</span>
          <input className={inputClass} placeholder="예: 부산 해운대구" {...register("region")} />
          <FieldError message={errors.region?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          네이버 플레이스 URL {isAudit ? <span className="text-accent">*</span> : null}
          <input
            className={inputClass}
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://..."
            {...register("placeUrl", {
              required: isAudit ? "네이버 플레이스 URL을 입력해주세요." : false,
            })}
          />
          <FieldError message={errors.placeUrl?.message} />
        </label>

        <label className="text-sm font-bold text-ink">
          현재 광고 여부
          <select className={inputClass} {...register("currentMarketing")}>
            <option value="">선택 안 함</option>
            <option value="none">현재 진행 없음</option>
            <option value="self">직접 관리 중</option>
            <option value="agency">대행사 이용 중</option>
            <option value="paid-ads">유료 광고 집행 중</option>
          </select>
        </label>

        <label className="text-sm font-bold text-ink">
          월 마케팅 예산
          <select className={inputClass} {...register("budget")}>
            <option value="">선택 안 함</option>
            <option value="under-500k">50만원 미만</option>
            <option value="500k-1m">50만~100만원</option>
            <option value="1m-3m">100만~300만원</option>
            <option value="over-3m">300만원 이상</option>
            <option value="undecided">아직 미정</option>
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-ink">관심 서비스</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <label
              key={service}
              className="flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-ivory px-3 text-sm font-medium text-ink"
            >
              <input
                type="checkbox"
                value={service}
                className="h-4 w-4 accent-[var(--accent)]"
                {...register("interestedServices")}
              />
              {service}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5">
        <label className="text-sm font-bold text-ink">
          가장 고민되는 부분
          <textarea
            className={cn(inputClass, "min-h-28 py-3")}
            placeholder="예: 플레이스 순위는 올랐는데 예약이 늘지 않습니다."
            {...register("concerns")}
          />
          <FieldError message={errors.concerns?.message} />
        </label>

        {isAudit ? (
          <label className="text-sm font-bold text-ink">
            경쟁업체 또는 참고 매장
            <textarea
              className={cn(inputClass, "min-h-24 py-3")}
              placeholder="비교해보고 싶은 매장이 있다면 적어주세요."
              {...register("competitor")}
            />
            <FieldError message={errors.competitor?.message} />
          </label>
        ) : (
          <label className="text-sm font-bold text-ink">
            기타 문의
            <textarea
              className={cn(inputClass, "min-h-24 py-3")}
              placeholder="상담 전에 전달하고 싶은 내용을 적어주세요."
              {...register("message")}
            />
            <FieldError message={errors.message?.message} />
          </label>
        )}

        <label className="text-sm font-bold text-ink">
          상담 가능 시간
          <input className={inputClass} placeholder="예: 평일 오후 2시 이후" {...register("preferredContactTime")} />
          <FieldError message={errors.preferredContactTime?.message} />
        </label>
      </div>

      <label className="mt-6 flex gap-3 rounded-[8px] border border-line bg-ivory p-4 text-sm leading-6 text-ink">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" {...register("privacyConsent")} />
        <span>
          상담 및 무료 진단 진행을 위해 입력한 개인정보를 수집·이용하는 데 동의합니다.
          입력 정보는 문의 확인과 연락 목적으로만 사용합니다.{" "}
          <Link href="/privacy" className="font-bold text-accent underline underline-offset-4">
            개인정보처리방침
          </Link>
          을 확인했습니다.
        </span>
      </label>
      <FieldError message={errors.privacyConsent?.message} />

      {serverError ? (
        <div className="mt-5 flex gap-2 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
        {isSubmitting ? "접수 중입니다" : isAudit ? "무료 진단 신청하기" : "상담 문의 제출하기"}
      </Button>
      <p className="mt-3 text-center text-xs leading-6 text-muted">
        제출 후 담당자가 내용을 확인한 뒤 연락드립니다. 자동 진단 결과가 즉시 제공되는 서비스는 아닙니다.
      </p>
    </form>
  );
}
