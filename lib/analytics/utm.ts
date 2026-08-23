"use client";

export type StoredAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
};

const storageKey = "local_marketing_first_touch";
const ttlDays = 90;

function toFormAttribution(raw: Record<string, string>): StoredAttribution {
  return {
    utmSource: raw.utm_source || "",
    utmMedium: raw.utm_medium || "",
    utmCampaign: raw.utm_campaign || "",
    utmContent: raw.utm_content || "",
    utmTerm: raw.utm_term || "",
    landingPage: raw.landing_page || "",
    referrer: raw.referrer || "",
  };
}

export function captureAttribution() {
  if (typeof window === "undefined") return;

  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as { expiresAt?: number };
      if (parsed.expiresAt && parsed.expiresAt > Date.now()) return;
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const raw = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    landing_page: window.location.href,
    referrer: document.referrer || "",
    expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  };

  if (raw.utm_source || raw.referrer) {
    window.localStorage.setItem(storageKey, JSON.stringify(raw));
  }
}

export function getStoredAttribution(): StoredAttribution {
  if (typeof window === "undefined") return {};

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return {
      landingPage: window.location.href,
      referrer: document.referrer || "",
    };
  }

  try {
    const parsed = JSON.parse(stored) as Record<string, string> & { expiresAt?: number };
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(storageKey);
      return {};
    }
    return toFormAttribution(parsed);
  } catch {
    window.localStorage.removeItem(storageKey);
    return {};
  }
}
