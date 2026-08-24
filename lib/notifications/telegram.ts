import type { LeadFormValues } from "@/lib/validations";

const telegramApiBase = "https://api.telegram.org";
const maxTelegramMessageLength = 3500;

function valueOrDash(value?: string | null) {
  return value?.trim() || "-";
}

function compact(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function formatList(items?: string[]) {
  return items?.length ? items.map((item) => compact(item)).filter(Boolean).join(", ") : "-";
}

function truncate(value: string, maxLength = maxTelegramMessageLength) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 20)}\n...내용 일부 생략`;
}

function leadTypeLabel(type: LeadFormValues["leadType"]) {
  return type === "free_audit" ? "무료 진단" : "일반 상담";
}

export function buildLeadTelegramMessage(values: LeadFormValues, receivedAt = new Date()) {
  const detailLines = [
    `업체명: ${valueOrDash(values.businessName)}`,
    `담당자: ${valueOrDash(values.contactName)}`,
    `연락처: ${valueOrDash(values.phone)}`,
    `업종: ${valueOrDash(values.industry)}`,
    `지역: ${valueOrDash(values.region)}`,
    `네이버 플레이스 URL: ${valueOrDash(values.placeUrl)}`,
    `관심 서비스: ${formatList(values.interestedServices)}`,
    `현재 광고 여부: ${valueOrDash(values.currentMarketing)}`,
    `월 예산: ${valueOrDash(values.budget)}`,
    `상담 가능 시간: ${valueOrDash(values.preferredContactTime)}`,
  ];

  const noteLines = [
    values.concerns ? `가장 큰 고민:\n${values.concerns.trim()}` : "",
    values.message ? `문의내용:\n${values.message.trim()}` : "",
    values.competitor ? `경쟁업체/참고 매장:\n${values.competitor.trim()}` : "",
  ].filter(Boolean);

  const attributionLines = [
    `Source: ${valueOrDash(values.utmSource || (values.referrer ? "referral" : "direct"))}`,
    `Medium: ${valueOrDash(values.utmMedium)}`,
    `Campaign: ${valueOrDash(values.utmCampaign)}`,
    `Landing: ${valueOrDash(values.landingPage)}`,
    `Referrer: ${valueOrDash(values.referrer)}`,
  ];

  return truncate(
    [
      `새로운 ${leadTypeLabel(values.leadType)} 문의`,
      "",
      ...detailLines,
      "",
      ...noteLines,
      "",
      "유입 정보",
      ...attributionLines,
      "",
      `접수시간: ${new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Seoul",
      }).format(receivedAt)}`,
    ]
      .filter((line) => line !== "")
      .join("\n"),
  );
}

export async function sendLeadTelegramNotification(values: LeadFormValues) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.info("[telegram] Lead notification skipped: Telegram environment variables are not configured.");
    return { ok: false, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${telegramApiBase}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildLeadTelegramMessage(values),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("[telegram] Lead notification failed.", { status: response.status });
      return { ok: false, skipped: false };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    console.warn("[telegram] Lead notification request failed.", { reason });
    return { ok: false, skipped: false };
  } finally {
    clearTimeout(timeout);
  }
}
