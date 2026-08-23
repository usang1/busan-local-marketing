import { MockPaymentProvider } from "@/lib/payment/mock-provider";
import { TossPaymentProvider } from "@/lib/payment/toss-provider";
import type { PaymentProvider } from "@/lib/payment/types";

export function getConfiguredPaymentProviderName() {
  return process.env.PAYMENT_PROVIDER || process.env.PAYMENT_ENV || "mock";
}

export function isProductionMockPaymentBlocked() {
  return process.env.NODE_ENV === "production" && getConfiguredPaymentProviderName() === "mock";
}

export function isDirectPaymentAvailable() {
  const provider = getConfiguredPaymentProviderName();

  if (isProductionMockPaymentBlocked()) return false;
  if (provider === "toss" || provider === "sandbox" || provider === "production") {
    return Boolean(
      (process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || process.env.NEXT_PUBLIC_PAYMENT_CLIENT_KEY) &&
        (process.env.TOSS_PAYMENTS_SECRET_KEY || process.env.PAYMENT_SECRET_KEY),
    );
  }

  return provider === "mock";
}

export function getPaymentProvider(): PaymentProvider {
  const provider = getConfiguredPaymentProviderName();

  if (provider === "toss" || provider === "sandbox" || provider === "production") {
    return new TossPaymentProvider();
  }

  return new MockPaymentProvider();
}

export function getPublicPaymentConfig() {
  return {
    provider: getConfiguredPaymentProviderName(),
    tossClientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || process.env.NEXT_PUBLIC_PAYMENT_CLIENT_KEY || "",
  };
}
