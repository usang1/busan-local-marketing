import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <>
      <AdminPageHeader title="상품 추가" description="향후 결제 연동을 고려해 가격 숫자와 가격 라벨을 분리해 입력합니다." />
      <ProductForm />
    </>
  );
}
