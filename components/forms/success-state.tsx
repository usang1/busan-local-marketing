import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { KakaoCta } from "@/components/ui/kakao-cta";

export function SuccessState({ type, kakaoChatUrl }: { type: "free_audit" | "consultation"; kakaoChatUrl?: string }) {
  const isAudit = type === "free_audit";

  return (
    <div className="rounded-[8px] border border-accent/25 bg-pale-mint p-6 sm:p-8">
      <CheckCircle2 className="text-accent" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-extrabold text-ink">
        {isAudit ? "무료 진단 신청이 완료되었습니다." : "상담 문의가 접수되었습니다."}
      </h2>
      <p className="mt-3 text-base leading-8 text-muted">
        {isAudit
          ? "남겨주신 업체와 플레이스 정보를 확인한 뒤 상담을 진행합니다. 추가로 전달할 내용이 있다면 카카오톡 또는 상담 문의로 남겨주세요."
          : "업체 정보와 문의 내용을 확인한 뒤 가능한 시간에 연락드릴 수 있도록 준비합니다."}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <KakaoCta label="카카오톡으로 추가 문의" kakaoChatUrl={kakaoChatUrl} />
        <ButtonLink href="/services" variant="outline">
          서비스 살펴보기
        </ButtonLink>
      </div>
    </div>
  );
}
