import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function KakaoCta({
  label = "카카오톡 상담하기",
  className,
  variant = "secondary",
  size = "md",
  location = "unknown",
  kakaoChatUrl,
}: {
  label?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  location?: string;
  kakaoChatUrl?: string | null;
}) {
  const chatUrl = kakaoChatUrl ?? SITE.kakaoChatUrl;
  const hasUrl = Boolean(chatUrl);
  const fallbackLabel = label.includes("카카오") ? "상담 문의하기" : label;

  return (
    <ButtonLink
      href={hasUrl ? chatUrl : "/contact"}
      className={className}
      variant={variant}
      size={size}
      target={hasUrl ? "_blank" : undefined}
      rel={hasUrl ? "noopener noreferrer" : undefined}
      data-analytics-event={hasUrl ? ANALYTICS_EVENTS.CLICK_KAKAO : ANALYTICS_EVENTS.CLICK_CONTACT}
      data-analytics-location={location}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {hasUrl ? label : fallbackLabel}
    </ButtonLink>
  );
}
