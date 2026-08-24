import Image from "next/image";
import Link from "next/link";
import { BRAND, NAV_ITEMS, SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white pb-24 pt-12 sm:pb-12">
      <div className="container-page grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Image src="/markivo-logo.svg" alt={BRAND.name} className="h-12 w-auto" width={167} height={48} />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">{BRAND.origin}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            {BRAND.region} 사업자를 위한 네이버 플레이스 중심 로컬 마케팅. 확인되지 않은
            순위 보장이나 매출 수치를 약속하지 않고, 현재 놓치고 있는 전환 요소를 먼저
            점검합니다.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-ink">메뉴</p>
          <nav className="grid gap-2 text-sm text-muted" aria-label="푸터 메뉴">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
            <Link href="/services/naver-place" className="hover:text-accent">
              네이버 플레이스 마케팅
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-accent">
              이용약관
            </Link>
          </nav>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-ink">문의 정보</p>
          <div className="grid gap-2 text-sm text-muted">
            <p>{BRAND.name} 상담 폼과 카카오톡 채널로 문의를 접수합니다.</p>
            {SITE.phone ? <p>{SITE.phone}</p> : null}
            {SITE.email ? <p>{SITE.email}</p> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
