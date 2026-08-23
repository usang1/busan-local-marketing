import { Buffer } from "node:buffer";
import type { CreatePaymentParams, CreatePaymentResult, PaymentProvider, VerifyPaymentParams, VerifyPaymentResult } from "@/lib/payment/types";

type TossConfirmResponse = {
  paymentKey: string;
  orderId: string;
  totalAmount: number;
  status: string;
};

export class TossPaymentProvider implements PaymentProvider {
  name = "toss";

  async createPayment(_params: CreatePaymentParams): Promise<CreatePaymentResult> {
    return { provider: this.name };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY || process.env.PAYMENT_SECRET_KEY;

    if (!secretKey) {
      return {
        ok: false,
        provider: this.name,
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount,
        status: "failed",
        failureCode: "MISSING_TOSS_SECRET",
        failureMessage: "Toss Payments Secret Key가 설정되지 않았습니다.",
      };
    }

    const authorization = Buffer.from(`${secretKey}:`).toString("base64");
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
        "Idempotency-Key": params.orderId,
      },
      body: JSON.stringify({
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount,
      }),
    });

    const body = (await response.json().catch(() => null)) as TossConfirmResponse | { code?: string; message?: string } | null;

    if (!response.ok || !body || !("totalAmount" in body)) {
      const errorBody = body && "code" in body ? body : null;
      return {
        ok: false,
        provider: this.name,
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount,
        status: "failed",
        failureCode: errorBody?.code || "TOSS_CONFIRM_FAILED",
        failureMessage: errorBody?.message || "결제 승인에 실패했습니다.",
        raw: body,
      };
    }

    const amountMatches = body.totalAmount === params.amount;
    const orderMatches = body.orderId === params.orderId;
    const paid = body.status === "DONE";

    return {
      ok: amountMatches && orderMatches && paid,
      provider: this.name,
      paymentKey: body.paymentKey,
      orderId: body.orderId,
      amount: body.totalAmount,
      status: amountMatches && orderMatches && paid ? "paid" : "failed",
      failureCode: amountMatches && orderMatches && paid ? undefined : "TOSS_PAYMENT_MISMATCH",
      failureMessage: amountMatches && orderMatches && paid ? undefined : "결제 정보가 주문 정보와 일치하지 않습니다.",
      raw: body,
    };
  }
}
