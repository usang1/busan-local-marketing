import Link from "next/link";
import { ArchiveButton } from "@/components/admin/archive-button";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { listProducts } from "@/lib/admin/db";
import { formatDate, formatPrice } from "@/lib/admin/format";

export default async function AdminProductsPage() {
  const { data, error } = await listProducts();

  return (
    <>
      <AdminPageHeader
        title="상품 관리"
        description="가격 페이지에 표시될 상품과 가격을 관리합니다."
        action={<Link className="rounded-[8px] bg-accent px-4 py-2 text-sm font-bold text-white" href="/admin/products/new">상품 추가</Link>}
      />
      {error ? <AdminError message={error} /> : null}
      {data.length ? (
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <table className="hidden min-w-full divide-y divide-slate-200 text-sm lg:table">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500"><tr><th className="px-4 py-3">상품명</th><th className="px-4 py-3">가격</th><th className="px-4 py-3">추천</th><th className="px-4 py-3">공개</th><th className="px-4 py-3">순서</th><th className="px-4 py-3">수정일</th><th className="px-4 py-3">관리</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-bold">{item.name}</td>
                  <td className="px-4 py-3">{formatPrice(item.price, item.price_label)}</td>
                  <td className="px-4 py-3">{item.recommended ? "추천" : "-"}</td>
                  <td className="px-4 py-3">{item.published ? "공개" : "비공개"}</td>
                  <td className="px-4 py-3">{item.sort_order}</td>
                  <td className="px-4 py-3">{formatDate(item.updated_at)}</td>
                  <td className="px-4 py-3"><div className="flex gap-2"><Link className="rounded-[8px] border border-slate-200 px-3 py-2 font-bold" href={`/admin/products/${item.id}/edit`}>수정</Link><ArchiveButton endpoint={`/api/admin/products/${item.id}`} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid divide-y divide-slate-100 lg:hidden">
            {data.map((item) => (
              <article key={item.id} className="p-4">
                <h2 className="font-extrabold">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{formatPrice(item.price, item.price_label)} · {item.published ? "공개" : "비공개"}</p>
                <div className="mt-3 flex gap-2"><Link className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm font-bold" href={`/admin/products/${item.id}/edit`}>수정</Link><ArchiveButton endpoint={`/api/admin/products/${item.id}`} /></div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="상품 없음" description="등록된 상품이 없습니다." action={<Link className="rounded-[8px] bg-accent px-4 py-2 text-sm font-bold text-white" href="/admin/products/new">상품 추가</Link>} />
      )}
    </>
  );
}
