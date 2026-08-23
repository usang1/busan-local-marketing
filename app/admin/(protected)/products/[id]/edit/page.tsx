import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/admin/db";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader title="상품 수정" description={product.name} />
      <ProductForm product={product} />
    </>
  );
}
