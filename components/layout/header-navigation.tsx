"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export type HeaderServiceGroup = {
  category: string;
  services: {
    slug: string;
    title: string;
    shortTitle: string;
  }[];
};

type HeaderNavItem = {
  label: string;
  href: string;
};

const desktopPanelId = "header-services-mega-menu";
const mobilePanelId = "header-mobile-menu";
const mobileServicesId = "header-mobile-services";

function serviceHref(slug: string) {
  return `/services/${slug}`;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/services") {
    return pathname === href || pathname.startsWith("/services/");
  }

  return pathname === href;
}

export function HeaderNavigation({
  navItems,
  serviceGroups,
}: {
  navItems: HeaderNavItem[];
  serviceGroups: HeaderServiceGroup[];
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDesktopServices = () => {
    clearCloseTimer();
    setDesktopServicesOpen(true);
  };

  const scheduleDesktopClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setDesktopServicesOpen(false);
    }, 120);
  };

  const closeAll = useCallback(() => {
    clearCloseTimer();
    setDesktopServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [clearCloseTimer]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeAll();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer, closeAll]);

  const serviceNavItem = navItems.find((item) => item.href === "/services");
  const otherNavItems = navItems.filter((item) => item.href !== "/services");

  return (
    <div ref={rootRef} className="contents">
      <nav aria-label="주요 메뉴" className="hidden items-center gap-1 lg:flex">
        {serviceNavItem ? (
          <div
            ref={servicesRef}
            onMouseEnter={openDesktopServices}
            onMouseLeave={scheduleDesktopClose}
            onFocusCapture={openDesktopServices}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                scheduleDesktopClose();
              }
            }}
          >
            <Link
              href={serviceNavItem.href}
              className={cn(
                "inline-flex items-center gap-1 rounded-[7px] px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/70 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20",
                isActivePath(pathname, serviceNavItem.href) && "bg-white/80 text-ink",
              )}
              aria-expanded={desktopServicesOpen}
              aria-controls={desktopPanelId}
              onClick={() => setDesktopServicesOpen(false)}
            >
              {serviceNavItem.label}
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={cn("transition-transform duration-150", desktopServicesOpen && "rotate-180")}
              />
            </Link>

            {desktopServicesOpen ? (
              <div
                id={desktopPanelId}
                className="absolute inset-x-0 top-full z-50 border-t border-line/70 bg-ivory/96 shadow-[0_24px_60px_rgba(31,42,46,0.14)] backdrop-blur-xl"
                onMouseEnter={openDesktopServices}
                onMouseLeave={scheduleDesktopClose}
              >
                <div className="container-page max-h-[calc(100vh-5rem)] overflow-y-auto py-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-extrabold text-ink">서비스</p>
                      <p className="mt-1 text-sm leading-6 text-muted">필요한 채널을 카테고리별로 확인하세요.</p>
                    </div>
                    <Link
                      href="/services"
                      className="shrink-0 rounded-[7px] border border-line bg-white/80 px-4 py-2 text-sm font-bold text-ink transition hover:border-accent/40 hover:bg-pale-mint/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                      onClick={() => setDesktopServicesOpen(false)}
                    >
                      서비스 전체보기
                    </Link>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {serviceGroups.map((group) => (
                      <section key={group.category} className="rounded-[8px] border border-line bg-white/86 p-4">
                        <h2 className="text-sm font-extrabold text-accent">{group.category}</h2>
                        <div className="mt-3 grid gap-1">
                          {group.services.map((service) => (
                            <Link
                              key={service.slug}
                              href={serviceHref(service.slug)}
                              className="rounded-[7px] px-3 py-2 text-sm font-semibold leading-6 text-ink transition hover:bg-pale-mint/60 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                              onClick={() => setDesktopServicesOpen(false)}
                            >
                              {service.shortTitle}
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {otherNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[7px] px-3 py-2 text-sm font-semibold text-muted transition hover:bg-white/70 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20",
              isActivePath(pathname, item.href) && "bg-white/80 text-ink",
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
        aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={mobileOpen}
        aria-controls={mobilePanelId}
        onClick={() => {
          setMobileOpen((value) => !value);
          setDesktopServicesOpen(false);
        }}
      >
        {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {mobileOpen ? (
        <div id={mobilePanelId} className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-ivory shadow-[0_18px_40px_rgba(31,42,46,0.12)] lg:hidden">
          <nav className="container-page grid gap-1 py-4" aria-label="모바일 메뉴">
            {serviceNavItem ? (
              <div className="grid gap-2">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-[8px] px-3 py-3 text-left text-base font-semibold text-ink hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20",
                    isActivePath(pathname, serviceNavItem.href) && "bg-white/80",
                  )}
                  aria-expanded={mobileServicesOpen}
                  aria-controls={mobileServicesId}
                  onClick={() => setMobileServicesOpen((value) => !value)}
                >
                  <span>{serviceNavItem.label}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={cn("transition-transform duration-150", mobileServicesOpen && "rotate-180")}
                  />
                </button>

                {mobileServicesOpen ? (
                  <div id={mobileServicesId} className="max-h-[60vh] overflow-y-auto rounded-[8px] border border-line bg-white/84 p-3">
                    <Link
                      href="/services"
                      className="mb-3 block rounded-[7px] bg-pale-mint px-3 py-2 text-sm font-extrabold text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                      onClick={closeAll}
                    >
                      서비스 전체보기
                    </Link>
                    <div className="grid gap-4">
                      {serviceGroups.map((group) => (
                        <section key={group.category}>
                          <h2 className="px-1 text-xs font-extrabold text-accent">{group.category}</h2>
                          <div className="mt-2 grid gap-1">
                            {group.services.map((service) => (
                              <Link
                                key={service.slug}
                                href={serviceHref(service.slug)}
                                className="block rounded-[7px] px-3 py-2 text-sm font-semibold leading-6 text-ink hover:bg-pale-mint/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                                onClick={closeAll}
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {otherNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className="rounded-[8px] px-3 py-3 text-base font-semibold text-ink hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                data-analytics-event={item.href === "/contact" ? ANALYTICS_EVENTS.CLICK_CONTACT : undefined}
                data-analytics-location={item.href === "/contact" ? "header_mobile" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/free-audit" className="mt-2 w-full" onClick={closeAll} data-analytics-event={ANALYTICS_EVENTS.CLICK_FREE_AUDIT} data-analytics-location="header_mobile">
              무료 플레이스 진단받기
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
