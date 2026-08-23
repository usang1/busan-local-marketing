"use client";

import { ClipboardCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function MobileStickyCta() {
  const pathname = usePathname();
  const hiddenRoutes = ["/free-audit", "/contact", "/checkout", "/admin"];

  if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/94 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 shadow-[0_-12px_30px_rgba(31,42,46,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <ButtonLink href="/free-audit" size="sm" className="w-full" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="sticky_mobile">
          <ClipboardCheck size={17} aria-hidden="true" />
          무료 진단
        </ButtonLink>
        <KakaoCta label="카카오 상담" size="sm" className="w-full" location="sticky_mobile" />
      </div>
    </div>
  );
}
