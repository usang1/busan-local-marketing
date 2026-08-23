import { AdminPageHeader } from "@/components/admin/admin-page";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <>
      <AdminPageHeader title="새 포트폴리오" description="확인된 실제 데이터만 입력하세요. 허위 성과나 고객사는 등록하지 않습니다." />
      <PortfolioForm />
    </>
  );
}
