"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      window.dispatchEvent(new CustomEvent("app:error", { detail: { message: error.message } }));
    }
  }, [error.message]);

  return (
    <section className="container-page flex min-h-[70vh] items-center py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-bold text-accent">Error</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink">페이지를 불러오지 못했습니다</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          일시적인 오류일 수 있습니다. 다시 시도해도 같은 문제가 반복되면 상담 문의로 알려주세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-accent bg-accent px-5 text-sm font-semibold text-white"
          >
            다시 시도
          </button>
          <ButtonLink href="/" variant="outline">홈으로 이동</ButtonLink>
          <ButtonLink href="/free-audit" variant="outline">무료 진단 신청</ButtonLink>
        </div>
      </div>
    </section>
  );
}
