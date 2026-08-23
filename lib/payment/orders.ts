import { getPaymentProvider, isProductionMockPaymentBlocked } from "@/lib/payment/provider";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Order } from "@/types/database";

export function createOrderId() {
  return `ord_${crypto.randomUUID().replaceAll("-", "")}`.slice(0, 32);
}

export async function confirmOrderPayment({
  orderId,
  paymentKey,
  amount,
}: {
  orderId: string;
  paymentKey: string;
  amount: number;
}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase 환경변수가 없습니다.", order: null as Order | null };

  const { data: order } = await supabase
    .from("orders")
    .select("*, products(name, slug, price_label)")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!order) return { ok: false, message: "주문을 찾을 수 없습니다.", order: null as Order | null };

  const typedOrder = order as Order;
  if (typedOrder.payment_provider === "mock" && isProductionMockPaymentBlocked()) {
    return { ok: false, message: "운영 환경에서는 테스트 결제를 완료 처리할 수 없습니다.", order: null as Order | null };
  }

  if (typedOrder.status === "paid") {
    if (typedOrder.payment_key && typedOrder.payment_key !== paymentKey) {
      return { ok: false, message: "결제 식별자가 주문 정보와 일치하지 않습니다.", order: null as Order | null };
    }
    return { ok: true, message: "이미 결제 완료된 주문입니다.", order: typedOrder };
  }

  if (typedOrder.amount !== amount) {
    await supabase
      .from("orders")
      .update({
        status: "failed",
        failure_code: "AMOUNT_MISMATCH",
        failure_message: "요청 금액이 주문 금액과 일치하지 않습니다.",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);
    return { ok: false, message: "결제 금액이 주문 금액과 일치하지 않습니다.", order: typedOrder };
  }

  const provider = getPaymentProvider();
  const result = await provider.verifyPayment({ paymentKey, orderId, amount: typedOrder.amount });

  const update = result.ok
    ? {
        status: "paid",
        payment_key: result.paymentKey,
        payment_provider: result.provider,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : {
        status: "failed",
        payment_key: result.paymentKey,
        payment_provider: result.provider,
        failure_code: result.failureCode || "PAYMENT_FAILED",
        failure_message: result.failureMessage || "결제 검증에 실패했습니다.",
        updated_at: new Date().toISOString(),
      };

  const { data: updated } = await supabase
    .from("orders")
    .update(update)
    .eq("order_id", orderId)
    .select("*, products(name, slug, price_label)")
    .maybeSingle();

  return {
    ok: result.ok,
    message: result.ok ? "결제가 완료되었습니다." : "결제를 완료하지 못했습니다.",
    order: (updated as Order | null) || typedOrder,
  };
}
