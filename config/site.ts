export const BRAND = {
  name: "markivo",
  origin: "marketing + evolution",
  tagline: "매출로 연결되는 로컬 마케팅",
  region: "부산·경남",
  description:
    "marketing과 evolution을 결합한 markivo는 부산·경남 자영업자와 로컬 비즈니스를 위한 네이버 플레이스 중심 마케팅 파트너입니다.",
};

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  kakaoChatUrl: process.env.NEXT_PUBLIC_KAKAO_CHAT_URL || "https://open.kakao.com/o/sxR2zvFi",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
};

export const NAV_ITEMS = [
  { label: "서비스", href: "/services" },
  { label: "포트폴리오", href: "/portfolio" },
  { label: "가격", href: "/pricing" },
  { label: "무료 진단", href: "/free-audit" },
  { label: "상담", href: "/contact" },
];

export const SEO_KEYWORDS = [
  "부산 광고대행",
  "부산 광고대행사",
  "부산 마케팅",
  "부산 자영업자 마케팅",
  "부산 소상공인 마케팅",
  "경남 광고대행",
  "네이버 플레이스 마케팅",
  "네이버 플레이스 광고대행",
  "음식점 마케팅",
  "부산 음식점 마케팅",
  "병원 마케팅",
  "부산 병원 마케팅",
  "부산 카페 마케팅",
  "부산 미용실 마케팅",
  "자영업자 광고",
];
