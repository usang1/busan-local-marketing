"use client";

import { AlertCircle, Loader2, SearchCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

const inputClass =
  "mt-2 min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-base text-ink transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

const selectClass = inputClass;

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-bold text-ink">
      {label} {required ? <span className="text-accent">*</span> : null}
      {children}
    </label>
  );
}

export function PlaceAuditForm({ brandName = "부산 로컬 매장" }: { brandName?: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent(ANALYTICS_EVENTS.START_AUDIT, { audit_type: "naver_place_self_input" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;

    setLoading(false);
    if (!response.ok || !result?.id) {
      setError(result?.message || "자동진단 결과를 만들지 못했습니다. 입력값을 확인해주세요.");
      return;
    }

    trackEvent(ANALYTICS_EVENTS.COMPLETE_AUDIT, {
      audit_type: "naver_place_self_input",
      has_place_url: Boolean(String(body.placeUrl || "").trim()),
    });
    router.push(`/audit/result/${result.id}`);
  }

  return (
    <form
      className="rounded-[8px] border border-line bg-white p-5 shadow-[0_18px_60px_rgba(31,42,46,0.08)] sm:p-7"
      onChange={markStarted}
      onSubmit={onSubmit}
    >
      <div className="mb-6">
        <p className="text-sm font-bold text-accent">Auto Audit MVP</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">기본 자동진단 먼저 보기</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          네이버 데이터를 자동 수집하지 않고, 입력한 상태만 기준으로 개선 우선순위를 정리합니다.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="업체명" required>
          <input name="businessName" className={inputClass} required maxLength={80} placeholder={`예: ${brandName} 카페`} />
        </Field>
        <Field label="업종" required>
          <input name="industry" className={inputClass} required maxLength={80} placeholder="예: 음식점, 병원, 카페" />
        </Field>
        <Field label="지역" required>
          <input name="region" className={inputClass} required maxLength={80} placeholder="예: 부산 해운대구" />
        </Field>
        <Field label="네이버 플레이스 URL">
          <input name="placeUrl" className={inputClass} type="url" inputMode="url" maxLength={500} placeholder="https://..." />
        </Field>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="대표사진 준비 상태" required>
          <select name="representativePhotoStatus" className={selectClass} defaultValue="partial" required>
            <option value="ready">대표사진 있음</option>
            <option value="partial">대표사진 일부 있음</option>
            <option value="missing">대표사진 없음</option>
          </select>
        </Field>
        <Field label="메뉴/서비스 정보" required>
          <select name="menuInfoStatus" className={selectClass} defaultValue="partial" required>
            <option value="ready">메뉴/서비스 정보 있음</option>
            <option value="partial">일부 정보만 있음</option>
            <option value="missing">정보 없음</option>
          </select>
        </Field>
        <Field label="소개문구" required>
          <select name="introStatus" className={selectClass} defaultValue="partial" required>
            <option value="ready">소개문구 있음</option>
            <option value="partial">기본 소개만 있음</option>
            <option value="missing">소개문구 없음</option>
          </select>
        </Field>
        <Field label="사진 콘텐츠" required>
          <select name="photoContentStatus" className={selectClass} defaultValue="partial" required>
            <option value="ready">사진 충분히 있음</option>
            <option value="partial">일부 사진만 있음</option>
            <option value="missing">사진 없음</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="리뷰 수 범위" required>
          <select name="reviewCountRange" className={selectClass} defaultValue="unknown" required>
            <option value="unknown">잘 모름</option>
            <option value="none">거의 없음</option>
            <option value="under_10">10개 미만</option>
            <option value="10_50">10~50개</option>
            <option value="over_50">50개 이상</option>
          </select>
        </Field>
        <Field label="최근 리뷰 상태" required>
          <select name="recentReviewStatus" className={selectClass} defaultValue="unknown" required>
            <option value="unknown">잘 모름</option>
            <option value="recent">최근 리뷰 있음</option>
            <option value="old">최근 리뷰가 오래됨</option>
            <option value="none">리뷰 없음</option>
          </select>
        </Field>
        <Field label="리뷰 답변" required>
          <select name="reviewReplyStatus" className={selectClass} defaultValue="unknown" required>
            <option value="active">답변하고 있음</option>
            <option value="partial">일부만 답변</option>
            <option value="none">답변 없음</option>
            <option value="unknown">잘 모름</option>
          </select>
        </Field>
        <Field label="쿠폰/이벤트" required>
          <select name="couponEventStatus" className={selectClass} defaultValue="unknown" required>
            <option value="active">진행 중</option>
            <option value="planned">준비 중</option>
            <option value="none">없음</option>
            <option value="unknown">잘 모름</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {[
          ["phoneEnabled", "전화 버튼"],
          ["reservationEnabled", "예약 동선"],
          ["directionsReady", "길찾기 정보"],
          ["inquiryEnabled", "문의 동선"],
          ["competitorPrepared", "비교할 경쟁업체"],
        ].map(([name, label]) => (
          <Field key={name} label={label} required>
            <select name={name} className={selectClass} defaultValue="unknown" required>
              <option value="yes">있음</option>
              <option value="no">없음</option>
              <option value="unknown">잘 모름</option>
            </select>
          </Field>
        ))}
        <Field label="대표 키워드">
          <input name="primaryKeywords" className={inputClass} maxLength={160} placeholder="예: 부산 해운대 파스타, 가족 외식" />
        </Field>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          ["blogStatus", "블로그 운영"],
          ["shortFormStatus", "숏폼 운영"],
          ["snsStatus", "SNS 운영"],
        ].map(([name, label]) => (
          <Field key={name} label={label} required>
            <select name={name} className={selectClass} defaultValue="irregular" required>
              <option value="active">운영 중</option>
              <option value="irregular">가끔 운영</option>
              <option value="none">운영 안 함</option>
            </select>
          </Field>
        ))}
      </div>

      {error ? (
        <div className="mt-5 flex gap-2 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <SearchCheck size={19} aria-hidden="true" />}
        {loading ? "진단 중입니다" : "자동진단 결과 보기"}
      </Button>
    </form>
  );
}
