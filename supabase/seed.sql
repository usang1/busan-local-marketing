insert into public.products (
  name,
  slug,
  description,
  price,
  price_label,
  features,
  recommended,
  published,
  sort_order,
  purchase_type
) values
  (
    'STARTER',
    'starter',
    '플레이스 기본 구조와 검색 화면을 먼저 점검하고, 지금 바로 손댈 항목을 정리합니다.',
    null,
    '상담 후 안내',
    '["네이버 플레이스 기본 진단","대표사진·정보 구성 점검","지역/업종 키워드 확인","개선 우선순위 제안"]'::jsonb,
    false,
    true,
    10,
    'consultation_required'
  ),
  (
    'GROWTH',
    'growth',
    '플레이스, 블로그, 리뷰 흐름을 함께 보며 문의와 예약으로 이어지는 구조를 개선합니다.',
    null,
    '상담 후 안내',
    '["경쟁업체 분석","월간 콘텐츠 방향 설계","리뷰 메시지 점검","전화/예약 동선 개선 제안"]'::jsonb,
    true,
    true,
    20,
    'consultation_required'
  ),
  (
    'PREMIUM',
    'premium',
    '숏폼, 샤오홍슈 등 발견 채널까지 포함해 상권과 고객층에 맞는 운영 범위를 설계합니다.',
    null,
    '상담 후 안내',
    '["플레이스·블로그 통합 전략","숏폼 콘텐츠 방향","중국 관광객 콘텐츠 구조","월간 개선 리포트 구조"]'::jsonb,
    false,
    true,
    30,
    'consultation_required'
  )
on conflict (slug) do nothing;
