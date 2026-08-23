"use client";

import Script from "next/script";
import { useEffect } from "react";
import { ANALYTICS_EVENTS, trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";
import { captureAttribution } from "@/lib/analytics/utm";

export function AnalyticsProvider() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  const enableGa = process.env.NODE_ENV === "production" && Boolean(measurementId);

  useEffect(() => {
    captureAttribution();

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-analytics-event]");
      if (!element) return;

      const eventName = element.dataset.analyticsEvent as AnalyticsEventName | undefined;
      if (!eventName) return;

      trackEvent(eventName, {
        cta_location: element.dataset.analyticsLocation,
        product_id: element.dataset.productId,
        product_name: element.dataset.productName,
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const node = document.querySelector<HTMLScriptElement>("script[data-purchase-event]");
    if (!node?.textContent) return;
    try {
      const payload = JSON.parse(node.textContent) as Record<string, string | number>;
      const key = `purchase_tracked_${payload.order_id}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
      trackEvent(ANALYTICS_EVENTS.PURCHASE, payload);
    } catch {
      // Ignore malformed internal payload.
    }
  }, []);

  return (
    <>
      {enableGa ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
