import type { CreatePaymentParams, CreatePaymentResult, PaymentProvider, VerifyPaymentParams, VerifyPaymentResult } from "@/lib/payment/types";

export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async createPayment(_params: CreatePaymentParams): Promise<CreatePaymentResult> {
    return { provider: this.name };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const valid = params.paymentKey === `mock_${params.orderId}` && params.amount > 0;

    return {
      ok: valid,
      provider: this.name,
      paymentKey: params.paymentKey,
      orderId: params.orderId,
      amount: params.amount,
      status: valid ? "paid" : "failed",
      failureCode: valid ? undefined : "MOCK_PAYMENT_INVALID",
      failureMessage: valid ? undefined : "Mock 결제 검증에 실패했습니다.",
    };
  }
}
