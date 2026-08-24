"use client";

import { AlertCircle, Loader2, SearchCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

const inputClass =
  "mt-2 min-h-12 w-full rounded-[8px] border border-line bg-white px-3 text-base text-ink transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

const loadingSteps = [
  "네이버 플레이스 확인 중",
  "매장 정보 분석 중",
  "리뷰/콘텐츠 확인 중",
  "개선 포인트 계산 중",
  "진단 완료 준비 중",
];

type AnalyzeResponse = {
  success?: boolean;
  id?: string;
  code?: string;
  message?: string;
};

export function PlaceAuditForm({ brandName = "markivo" }: { brandName?: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, loadingSteps.length - 1));
    }, 900);

    return () => window.clearInterval(timer);
  }, [loading]);

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent(ANALYTICS_EVENTS.START_AUDIT, { audit_type: "naver_place_url" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStepIndex(0);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const placeUrl = String(formData.get("placeUrl") || "").trim();

    if (!placeUrl) {
      setLoading(false);
      setError("올바른 네이버 플레이스 주소를 입력해주세요.");
      return;
    }

    const response = await fetch("/api/place/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeUrl }),
    });
    const result = (await response.json().catch(() => null)) as AnalyzeResponse | null;

    setLoading(false);
    if (!response.ok || !result?.success || !result.id) {
      setError(result?.message || "현재 네이버 플레이스 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    trackEvent(ANALYTICS_EVENTS.COMPLETE_AUDIT, {
      audit_type: "naver_place_url",
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
        <p className="text-sm font-bold text-accent">Live Place Audit</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">네이버 플레이스 URL로 바로 진단</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          사용자가 리뷰 수나 사진 상태를 직접 고르지 않습니다. 입력한 네이버 플레이스 공개 정보를 서버에서 확인해 가능한 항목만 진단합니다.
        </p>
      </div>

      <label className="text-sm font-bold text-ink">
        네이버 플레이스 주소 <span className="text-accent">*</span>
        <input
          name="placeUrl"
          className={inputClass}
          type="text"
          inputMode="url"
          required
          maxLength={500}
          placeholder={`예: https://m.place.naver.com/place/1234567890/home`}
          onFocus={markStarted}
          aria-describedby="place-url-help"
        />
      </label>
      <p id="place-url-help" className="mt-3 text-xs leading-6 text-muted">
        `m.place.naver.com`, `map.naver.com` 주소를 사용할 수 있습니다. 네이버 단축 공유 URL은 안전하게 확인 가능한 경우에만 처리합니다.
      </p>

      {loading ? (
        <div className="mt-5 rounded-[8px] border border-accent/20 bg-pale-mint p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-accent">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            {loadingSteps[stepIndex]}
          </div>
          <ol className="mt-4 grid gap-2 text-xs leading-5 text-muted">
            {loadingSteps.map((step, index) => (
              <li key={step} className={index <= stepIndex ? "font-bold text-ink" : undefined}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 flex gap-2 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <SearchCheck size={19} aria-hidden="true" />}
        {loading ? "진단 중입니다" : "무료 자동진단 시작"}
      </Button>

      <p className="mt-4 text-xs leading-6 text-muted">
        공개 페이지에서 확인되지 않는 리뷰, 메뉴, 영업시간은 점수에서 제외합니다. {brandName}가 확인하지 못한 값을 임의로 만들지 않습니다.
      </p>
    </form>
  );
}
