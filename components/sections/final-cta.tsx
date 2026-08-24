import { ClipboardCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getPublicSiteProfile } from "@/lib/public/site-config";

export async function FinalCta() {
  const { site } = await getPublicSiteProfile();

  return (
    <section className="bg-ink py-16 text-white sm:py-20">
      <div className="container-page grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-bold text-pale-mint">무료 네이버 플레이스 진단</p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
            우리 매장은 지금
            <br />
            어디에서 고객을 놓치고 있을까요?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
            광고부터 시작하기 전에 현재 플레이스와 경쟁 매장을 먼저 확인해보세요.
            담당자가 확인 후 상담으로 안내합니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px] md:grid-cols-1">
          <ButtonLink href="/free-audit" size="lg" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="final_cta">
            <ClipboardCheck size={19} aria-hidden="true" />
            무료 진단 신청
          </ButtonLink>
          <KakaoCta
            variant="outline"
            className="border-white/25 bg-white/10 text-white hover:bg-white/16"
            location="final_cta"
            kakaoChatUrl={site.kakaoChatUrl}
          />
        </div>
      </div>
    </section>
  );
}
