import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] items-center py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-bold text-accent">404</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          주소가 바뀌었거나 아직 공개되지 않은 페이지입니다. 필요한 정보를 찾기 어렵다면 무료 플레이스 진단이나 서비스 페이지에서 다시 시작할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">홈으로 이동</ButtonLink>
          <ButtonLink href="/services" variant="outline">서비스 보기</ButtonLink>
          <ButtonLink href="/free-audit" variant="outline">무료 진단 신청</ButtonLink>
        </div>
      </div>
    </section>
  );
}
