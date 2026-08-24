import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";
import { cn } from "@/lib/utils";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function PricingCard({
  plan,
  kakaoChatUrl,
}: {
  plan: {
    id?: string;
    name: string;
    label: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    href: string;
    slug?: string;
    featured?: boolean;
  };
  kakaoChatUrl?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-[8px] border bg-white p-6",
        plan.featured ? "border-accent shadow-[0_18px_50px_rgba(45,140,131,0.13)]" : "border-line",
      )}
    >
      {plan.featured ? (
        <div className="mb-4 inline-flex rounded-[6px] bg-pale-mint px-2.5 py-1 text-xs font-bold text-accent">
          추천 범위
        </div>
      ) : null}
      <p className="text-sm font-bold text-accent">{plan.name}</p>
      <h3 className="mt-2 text-2xl font-extrabold text-ink">{plan.label}</h3>
      <p className="mt-4 text-3xl font-extrabold text-ink">{plan.price}</p>
      <p className="mt-4 min-h-20 text-sm leading-7 text-muted">{plan.description}</p>
      <ul className="mt-6 grid gap-3 text-sm text-ink">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <Check className="mt-0.5 text-accent" size={16} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.href === "kakao" ? (
        <KakaoCta label={plan.cta} className="mt-7 w-full" location="pricing" kakaoChatUrl={kakaoChatUrl} />
      ) : (
        <ButtonLink
          href={plan.href}
          className="mt-7 w-full"
          variant={plan.featured ? "primary" : "outline"}
          data-analytics-event={ANALYTICS_EVENTS.SELECT_PRODUCT}
          data-product-id={plan.slug || plan.id || plan.name}
          data-product-name={plan.name}
        >
          {plan.cta}
        </ButtonLink>
      )}
    </article>
  );
}
