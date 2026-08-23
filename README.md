# 부산·경남 로컬 마케팅 웹사이트 + CRM

Next.js, TypeScript, Tailwind CSS, Supabase 기반 광고대행 랜딩페이지와 관리자 CRM입니다.

## 실행

```bash
npm install --no-bin-links
npm run dev
```

현재 Windows 드라이브 환경에서 Turbopack 포트 바인딩 문제가 있어 `dev`와 `build`는 webpack 모드로 고정되어 있습니다.

## 환경변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

필수:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

선택:

```bash
NEXT_PUBLIC_KAKAO_CHAT_URL=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=
PAYMENT_PROVIDER=mock
PAYMENT_ENV=sandbox
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=
TOSS_PAYMENTS_SECRET_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 Route Handler에서만 사용합니다. 클라이언트 번들에 노출하지 마십시오.
`TOSS_PAYMENTS_SECRET_KEY` 또는 `PAYMENT_SECRET_KEY`도 서버 전용입니다. 클라이언트 코드에서 사용하지 않습니다.

## Supabase Schema

기존 데이터를 삭제하지 않고 다음 migration을 적용합니다.

```sql
supabase/migrations/20260822_admin_crm.sql
supabase/migrations/20260823_payment_analytics_seo.sql
```

포함 내용:

- `leads.admin_memo` 추가
- `admin_users`
- `portfolios`
- `products`
- `site_settings`
- RLS policy
- `portfolio-images` Storage bucket 및 policy
- `leads` UTM attribution 컬럼
- `orders` 결제 주문 테이블 및 RLS policy
- `site_settings.business_name`, `site_settings.address`

개발용 상품 seed가 필요하면 다음 파일을 적용합니다.

```sql
supabase/seed.sql
```

## 관리자 계정 생성

공개 signup 화면은 없습니다.

1. Supabase Dashboard > Authentication > Users에서 관리자 이메일/비밀번호 계정을 생성합니다.
2. 생성된 user id를 확인합니다.
3. SQL Editor에서 관리자 권한을 부여합니다.

```sql
insert into public.admin_users (user_id, role)
values ('SUPABASE_AUTH_USER_ID', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

4. `/admin/login`에서 이메일/비밀번호로 로그인합니다.

## 주요 경로

Public:

- `/`
- `/services`
- `/portfolio`
- `/portfolio/[slug]`
- `/free-audit`
- `/contact`
- `/pricing`

Admin:

- `/admin/login`
- `/admin`
- `/admin/leads`
- `/admin/audits`
- `/admin/leads/[id]`
- `/admin/portfolio`
- `/admin/portfolio/new`
- `/admin/portfolio/[id]/edit`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/settings`

Checkout:

- `/checkout?product=PRODUCT_SLUG`
- `/checkout/success`
- `/checkout/fail`

## 결제

결제 로직은 `lib/payment`의 Provider 인터페이스로 분리되어 있습니다.

- 기본값 `PAYMENT_PROVIDER=mock`: 외부 PG 키 없이 개발 검수용 Mock 결제로 처리합니다.
- Toss Payments 사용: `PAYMENT_PROVIDER=toss`, `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`, `TOSS_PAYMENTS_SECRET_KEY`를 설정합니다.
- Production에서는 `PAYMENT_PROVIDER=mock`가 기본적으로 결제 완료 처리되지 않습니다. 운영 결제 전에는 직접 결제 상품을 상담 동선으로 운영하세요.
- 주문 생성 시 브라우저 가격을 신뢰하지 않고 `products.slug`로 DB 상품을 다시 조회합니다.
- 성공 페이지는 URL 파라미터만으로 완료 처리하지 않고 서버에서 `orderId`, `paymentKey`, `amount`를 검증합니다.
- 카드번호, CVC, 카드 비밀번호는 저장하지 않습니다.

운영 전 Toss Payments 상점 등록, 테스트 결제 검수, 운영 키 교체, 환불 정책 확정이 필요합니다.

## GA4 / Analytics

`NEXT_PUBLIC_GA_MEASUREMENT_ID`가 설정되고 production 환경일 때만 GA4 스크립트를 로드합니다.

중앙 이벤트 목록은 `lib/analytics/events.ts`에서 관리합니다.

- `click_free_audit`
- `click_kakao`
- `click_contact`
- `start_free_audit_form`
- `submit_free_audit`
- `start_contact_form`
- `submit_contact`
- `view_pricing`
- `select_product`
- `begin_checkout`
- `purchase`
- `payment_failed`

이벤트에는 이름, 전화번호, 이메일, 문의 본문을 보내지 않습니다. CTA 위치는 `cta_location` 파라미터로 구분합니다.

## UTM Attribution

지원 파라미터:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

최초 유입 정보는 브라우저 first-party storage에 보관하고, 무료 진단/상담 Lead 및 주문 생성 시 함께 저장합니다. 관리자 Lead 상세와 주문 상세에서 Source, Medium, Campaign, Landing Page, Referrer를 확인할 수 있습니다.

## SEO / 검색엔진 등록

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- 관리자와 checkout 결과 페이지는 색인 제외
- Google Search Console 인증: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- 네이버 서치어드바이저 인증: `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`
- 주요 페이지는 Next.js Metadata API로 title, description, canonical, Open Graph를 설정합니다.
- 실제 리뷰, 별점, 주소가 확정되지 않았으므로 Review/AggregateRating/가짜 주소 LocalBusiness schema는 사용하지 않습니다.

운영 전 입력 필요:

- 브랜드명
- 사업자명, 대표자, 사업장 주소
- 대표 전화번호, 이메일
- 카카오톡 상담 URL
- 실제 공개 상품 가격과 결제 가능 여부
- 개인정보처리방침
- 이용약관
- 환불/취소 정책
- PG 운영 Key
- GA4 Measurement ID

## 검증

```bash
npm run lint
npm run typecheck
npm run build
```

## 운영 문서

- `PRODUCTION_CHECKLIST.md`: 배포 전 필수 확인 항목
- `OPERATIONS.md`: 관리자 CRM, 포트폴리오, 상품, 주문 운영 방법

## 배포

권장 배포 플랫폼은 Vercel입니다.

- Framework: Next.js
- Build Command: `npm run build`
- Node: `>=20.18.0`
- Region: `icn1`
- Environment Variables: `.env.example` 기준으로 Production 값 설정
- Domain: `NEXT_PUBLIC_SITE_URL`과 Vercel Production Domain을 일치시킵니다.

Supabase는 별도 Production project를 사용하고, migration 적용 후 관리자 계정을 생성합니다. 운영 데이터가 있는 DB에서 reset 명령을 사용하지 마십시오.
