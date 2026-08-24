export const ANALYTICS_EVENTS = {
  CLICK_FREE_AUDIT: "click_free_audit",
  CLICK_KAKAO: "click_kakao",
  CLICK_CONTACT: "click_contact",
  START_FREE_AUDIT_FORM: "start_free_audit_form",
  SUBMIT_FREE_AUDIT: "submit_free_audit",
  START_CONTACT_FORM: "start_contact_form",
  SUBMIT_CONTACT: "submit_contact",
  START_AUDIT: "start_audit",
  COMPLETE_AUDIT: "complete_audit",
  VIEW_AUDIT_RESULT: "view_audit_result",
  CLICK_AUDIT_CONSULTATION: "click_audit_consultation",
  VIEW_PRICING: "view_pricing",
  SELECT_PRODUCT: "select_product",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  PAYMENT_FAILED: "payment_failed",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const piiKeys = new Set([
  "email",
  "phone",
  "name",
  "customer_name",
  "contact_name",
  "business_name",
  "message",
  "place_url",
  "url",
  "request_note",
]);

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined && !piiKeys.has(key)),
  );
  safeParams.page_path = window.location.pathname;

  if (process.env.NODE_ENV !== "production") {
    window.dispatchEvent(new CustomEvent("analytics:debug", { detail: { eventName, params: safeParams } }));
    return;
  }

  window.gtag?.("event", eventName, safeParams);
}
