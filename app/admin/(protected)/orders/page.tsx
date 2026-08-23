import Link from "next/link";
import { AdminError, AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { orderStatusLabels } from "@/lib/admin/constants";
import { listOrders } from "@/lib/admin/db";
import { formatDateTime, formatPrice } from "@/lib/admin/format";

export default async function AdminOrdersPage() {
  const { data, error } = await listOrders();

  return (
    <>
      <AdminPageHeader title="주문 / 결제" description="결제 가능한 상품의 주문과 결제 상태를 확인합니다." />
      {error ? <AdminError message={error} /> : null}
      {data.length ? (
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <table className="hidden min-w-full divide-y divide-slate-200 text-sm lg:table">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
              <tr><th className="px-4 py-3">주문번호</th><th className="px-4 py-3">업체명</th><th className="px-4 py-3">고객명</th><th className="px-4 py-3">상품</th><th className="px-4 py-3">금액</th><th className="px-4 py-3">상태</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">생성일</th><th className="px-4 py-3">결제일</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-bold"><Link href={`/admin/orders/${order.id}`}>{order.order_id}</Link></td>
                  <td className="px-4 py-3">{order.business_name}</td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.products?.name || "-"}</td>
                  <td className="px-4 py-3">{formatPrice(order.amount, "")}</td>
                  <td className="px-4 py-3">{orderStatusLabels[order.status]}</td>
                  <td className="px-4 py-3">{order.payment_provider}</td>
                  <td className="px-4 py-3">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3">{formatDateTime(order.paid_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid divide-y divide-slate-100 lg:hidden">
            {data.map((order) => (
              <article key={order.id} className="p-4">
                <Link href={`/admin/orders/${order.id}`} className="font-extrabold">{order.order_id}</Link>
                <p className="mt-1 text-sm text-slate-600">{order.business_name} · {order.products?.name || "-"}</p>
                <p className="mt-2 text-sm font-bold">{formatPrice(order.amount, "")} · {orderStatusLabels[order.status]}</p>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="주문 없음" description="아직 생성된 주문이 없습니다." />
      )}
    </>
  );
}
