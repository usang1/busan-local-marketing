import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ServiceCard({
  title,
  eyebrow,
  description,
  items,
  icon: Icon,
  href = "/services",
}: {
  title: string;
  eyebrow: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  href?: string;
}) {
  return (
    <article className="group rounded-[8px] border border-line bg-white/78 p-6 transition hover:-translate-y-1 hover:border-accent/30 hover:bg-white">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-pale-mint text-accent">
        <Icon size={21} aria-hidden="true" />
      </div>
      <p className="text-xs font-bold text-accent">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-7 text-muted">{description}</p>
      <ul className="mt-5 grid gap-2 text-sm text-ink">
        {items.slice(0, 6).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
      >
        서비스 확인하기
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
