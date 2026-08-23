import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "결제 실패",
  robots: { index: false, follow: false },
};

export default async function CheckoutFailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <Section className="pt-12 sm:pt-16">
      <div className="mx-auto max-w-2xl rounded-[8px] border border-line bg-white p-6 text-center sm:p-8">
        <h1 className="text-3xl font-extrabold text-ink">결제를 완료하지 못했습니다.</h1>
        <p className="mt-3 text-base leading-8 text-muted">
          결제가 취소되었거나 승인 과정에서 문제가 발생했습니다. 카드 정보나 내부 결제 오류의
          상세 내용은 이 페이지에 표시하지 않습니다.
        </p>
        {params.orderId ? <p className="mt-4 text-sm text-muted">주문번호: {params.orderId}</p> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ButtonLink href="/pricing">상품으로 돌아가기</ButtonLink>
          <ButtonLink href="/pricing" variant="outline">다시 시도</ButtonLink>
          <KakaoCta label="카카오톡 문의" />
        </div>
      </div>
    </Section>
  );
}
