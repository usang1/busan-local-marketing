export type CreatePaymentParams = {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
};

export type CreatePaymentResult = {
  provider: string;
  checkoutUrl?: string;
};

export type VerifyPaymentParams = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type VerifyPaymentResult = {
  ok: boolean;
  provider: string;
  paymentKey: string;
  orderId: string;
  amount: number;
  status: "paid" | "failed";
  failureCode?: string;
  failureMessage?: string;
  raw?: unknown;
};

export interface PaymentProvider {
  name: string;
  createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
}
