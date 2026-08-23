import { faqs } from "@/data/faqs";
import { Section, SectionHeading } from "@/components/ui/section";

export function FaqSection() {
  return (
    <Section className="bg-white/60">
      <SectionHeading
        eyebrow="FAQ"
        title="광고대행사를 믿기 어려운 이유부터 답합니다"
        description="확인되지 않은 보장보다, 실제로 점검하고 관리할 수 있는 범위를 먼저 분명히 안내합니다."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-[8px] border border-line bg-white p-5">
            <summary className="cursor-pointer text-base font-bold text-ink">{faq.question}</summary>
            <p className="mt-4 text-sm leading-7 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
