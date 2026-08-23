"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRAND, NAV_ITEMS } from "@/config/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/86 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex min-w-0 flex-col rounded-[6px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
          onClick={() => setOpen(false)}
        >
          <span className="text-base font-extrabold tracking-normal text-ink">{BRAND.name}</span>
          <span className="hidden text-xs font-medium text-muted sm:block">{BRAND.tagline}</span>
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[7px] px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/70 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20",
                pathname === item.href && "bg-white/80 text-ink",
              )}
              data-analytics-event={item.href === "/contact" ? ANALYTICS_EVENTS.CLICK_CONTACT : undefined}
              data-analytics-location={item.href === "/contact" ? "header" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/free-audit" size="sm" data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="header">
            무료 진단
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-white/70 text-ink lg:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-ivory lg:hidden">
          <nav className="container-page grid gap-1 py-4" aria-label="모바일 메뉴">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[8px] px-3 py-3 text-base font-semibold text-ink hover:bg-white"
                data-analytics-event={item.href === "/contact" ? ANALYTICS_EVENTS.CLICK_CONTACT : undefined}
                data-analytics-location={item.href === "/contact" ? "header_mobile" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/free-audit" className="mt-2 w-full" onClick={() => setOpen(false)} data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="header_mobile">
              무료 플레이스 진단받기
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
