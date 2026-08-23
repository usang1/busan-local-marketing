# Production Checklist

운영 배포 전에 아래 항목을 실제 값으로 확인합니다. 실제 정보가 없는 항목을 임의로 채우지 마십시오.

## 운영 차단 항목

- [ ] `npm run lint` 통과
- [ ] `npm run typecheck` 통과
- [ ] `npm run build` 통과
- [ ] Supabase production project에 migration 적용
- [ ] RLS 정책 확인: leads, portfolios, products, orders, site_settings, storage
- [ ] 관리자 계정 생성 및 `admin_users` 권한 부여
- [ ] 공개 signup 화면이 없는지 확인
- [ ] `NEXT_PUBLIC_SITE_URL`을 실제 HTTPS 도메인으로 설정
- [ ] Production에서 `PAYMENT_PROVIDER=mock`를 사용하지 않음
- [ ] 결제를 활성화한다면 실제 개인정보처리방침, 이용약관, 환불정책 확정
- [ ] GA4에 이름, 전화번호, 이메일, 문의 내용이 전송되지 않는지 확인

## 브랜드 / 사업자 정보

- [ ] 브랜드명
- [ ] Tagline
- [ ] 사업자명
- [ ] 대표자명
- [ ] 사업장 주소
- [ ] 대표 전화번호
- [ ] 대표 이메일
- [ ] 카카오톡 상담 URL
- [ ] 서비스 지역

## 콘텐츠

- [ ] 실제 Hero 이미지 또는 분석 작업 화면으로 교체
- [ ] Hero 이미지 용량 최적화
- [ ] 실제 포트폴리오 입력
- [ ] 포트폴리오 결과는 기간, 기준 시점, 지표 맥락을 함께 작성
- [ ] Placeholder 사례가 공개 상태인지 확인
- [ ] 허위 후기, 허위 고객사, 허위 성과 없음
- [ ] 상품별 가격 또는 `상담 후 안내` 상태 확인
- [ ] 상품별 `direct` / `consultation_required` 확인

## 결제

- [ ] Toss Payments 상점 준비
- [ ] `PAYMENT_PROVIDER=toss`
- [ ] `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`
- [ ] `TOSS_PAYMENTS_SECRET_KEY`
- [ ] Sandbox 결제 검수
- [ ] 운영 키 전환 후 소액 결제 검수
- [ ] 결제 실패/취소 안내 확인
- [ ] 관리자 주문 목록/상세 확인

## Analytics / Attribution

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] `click_free_audit`
- [ ] `click_kakao`
- [ ] `click_contact`
- [ ] `start_free_audit_form`
- [ ] `submit_free_audit`
- [ ] `submit_contact`
- [ ] `select_product`
- [ ] `begin_checkout`
- [ ] `purchase`
- [ ] UTM이 Lead 상세에 저장되는지 확인
- [ ] UTM이 Order 상세에 저장되는지 확인

## SEO / 검색엔진

- [ ] Google Search Console 등록
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- [ ] Sitemap 제출: `/sitemap.xml`
- [ ] Naver Search Advisor 등록
- [ ] `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`
- [ ] robots 확인: `/robots.txt`
- [ ] 주요 페이지 title/description/canonical 확인
- [ ] 없는 주소, 없는 리뷰, 가짜 별점 structured data 없음

## 모바일 QA

- [ ] 320px
- [ ] 360px
- [ ] 375px
- [ ] 390px
- [ ] 430px
- [ ] Tablet
- [ ] Desktop
- [ ] Form 입력 중 sticky CTA가 가리지 않음
- [ ] Checkout 모바일 표시
- [ ] Admin Lead 상세 모바일 확인

