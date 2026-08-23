"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsParams } from "@/lib/analytics/events";

export function PageEvent({
  eventName,
  params,
}: {
  eventName: AnalyticsEventName;
  params?: AnalyticsParams;
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    trackEvent(eventName, params);
  }, [eventName, params]);

  return null;
}
