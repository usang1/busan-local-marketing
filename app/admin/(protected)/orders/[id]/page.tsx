import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminError, AdminPageHeader } from "@/components/admin/admin-page";
import { orderStatusLabels } from "@/lib/admin/constants";
import { getOrder } from "@/lib/admin/db";
import { formatDateTime, formatPrice } from "@/lib/admin/format";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 break-all text-sm leading-6 text-slate-900">{value || "-"}</dd>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: order, error } = await getOrder(id);
  if (!order && !error) notFound();

  return (
    <>
      <AdminPageHeader title="주문 상세" description={order?.order_id} />
      {error ? <AdminError message={error} /> : null}
      {order ? (
        <div className="grid gap-5 xl:grid-cols-3">
          <section className="rounded-[8px] border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold">주문</h2>
            <dl className="mt-5 grid gap-5">
              <Row label="주문번호" value={order.order_id} />
              <Row label="상품" value={order.products?.name} />
              <Row label="금액" value={formatPrice(order.amount, "")} />
              <Row label="상태" value={orderStatusLabels[order.status]} />
            </dl>
          </section>
          <section className="rounded-[8px] border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold">고객</h2>
            <dl className="mt-5 grid gap-5">
              <Row label="업체명" value={order.business_name} />
              <Row label="담당자" value={order.customer_name} />
              <Row label="연락처" value={order.phone} />
              <Row label="이메일" value={order.email} />
              <Row label="요청사항" value={order.request_note} />
            </dl>
          </section>
          <section className="rounded-[8px] border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold">결제</h2>
            <dl className="mt-5 grid gap-5">
              <Row label="Provider" value={order.payment_provider} />
              <Row label="Payment Identifier" value={order.payment_key} />
              <Row label="생성일" value={formatDateTime(order.created_at)} />
              <Row label="결제일" value={formatDateTime(order.paid_at)} />
              <Row label="실패 코드" value={order.failure_code} />
            </dl>
            {order.lead_id ? <Link className="mt-5 inline-flex rounded-[8px] border border-slate-200 px-3 py-2 text-sm font-bold" href={`/admin/leads/${order.lead_id}`}>연결 Lead 보기</Link> : null}
          </section>
          <section className="rounded-[8px] border border-slate-200 bg-white p-5 xl:col-span-3">
            <h2 className="text-lg font-extrabold">유입 정보</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Row label="Source" value={order.utm_source || "직접 유입 / 확인 불가"} />
              <Row label="Medium" value={order.utm_medium || "확인 불가"} />
              <Row label="Campaign" value={order.utm_campaign || "확인 불가"} />
              <Row label="Content" value={order.utm_content || "확인 불가"} />
              <Row label="Term" value={order.utm_term || "확인 불가"} />
              <Row label="Landing Page" value={order.landing_page || "확인 불가"} />
              <Row label="Referrer" value={order.referrer || "확인 불가"} />
            </dl>
          </section>
        </div>
      ) : null}
    </>
  );
}
