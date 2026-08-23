import { NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/payment/orders";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    paymentKey?: string;
    amount?: number;
  } | null;

  if (!body?.orderId || !body.paymentKey || typeof body.amount !== "number") {
    return NextResponse.json({ message: "결제 검증 정보를 확인해주세요." }, { status: 400 });
  }

  const result = await confirmOrderPayment({
    orderId: body.orderId,
    paymentKey: body.paymentKey,
    amount: body.amount,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
