import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { getPortfolioById } from "@/lib/admin/db";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolioById(id);
  if (!portfolio) notFound();

  return (
    <>
      <AdminPageHeader title="포트폴리오 수정" description={portfolio.title} />
      <PortfolioForm portfolio={portfolio} />
    </>
  );
}
