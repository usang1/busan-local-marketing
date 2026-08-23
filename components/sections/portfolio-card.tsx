import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PublicPortfolio } from "@/lib/public/content";

export function PortfolioCard({ item }: { item: PublicPortfolio }) {
  return (
    <article className="overflow-hidden rounded-[8px] border border-line bg-white transition hover:-translate-y-1 hover:border-accent/30">
      {item.thumbnailUrl ? (
        <img className="aspect-[16/10] w-full object-cover" src={item.thumbnailUrl} alt={`${item.title} 대표 이미지`} loading="lazy" />
      ) : (
        <div className="aspect-[16/10] bg-[linear-gradient(135deg,#eaf4f7,#e8f4ee_52%,#f3ece0)] p-5">
          <div className="flex h-full flex-col justify-between rounded-[8px] border border-white/80 bg-white/52 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-muted">
              <span>{item.industry}</span>
              <span>{item.location}</span>
            </div>
            <div>
              <div className="mb-3 h-2 w-24 rounded-full bg-accent/30" />
              <div className="mb-2 h-2 w-40 rounded-full bg-ink/10" />
              <div className="h-2 w-28 rounded-full bg-ink/10" />
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 inline-flex rounded-[6px] bg-soft-beige px-2.5 py-1 text-xs font-bold text-ink">
          {item.status === "placeholder" ? "사례 구조 예시" : "Case Study"}
        </div>
        <p className="text-sm font-bold text-accent">{item.client}</p>
        <h3 className="mt-2 text-xl font-bold text-ink">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
        <Link
          href={`/portfolio/${item.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent"
        >
          사례 흐름 보기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
