export type PaymentProviderConfiguration = {
  providerName: string | null;
  configured: boolean;
  missing: string[];
};

export type PaymentCheckoutRequest = {
  paymentOrderId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  customerId: string;
  engagementId: string;
};

export type PaymentCheckoutResult = {
  providerPaymentRef: string;
  status: "PENDING" | "REQUIRES_ACTION" | "PROCESSING";
  checkoutUrl?: string;
  clientSecret?: string;
};

export interface PaymentGatewayAdapter {
  readonly providerName: string;
  createCheckout(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResult>;
}

export function getPaymentProviderConfiguration(): PaymentProviderConfiguration {
  const providerName = process.env.PAYMENT_PROVIDER?.trim() || null;
  const required = [
    ["PAYMENT_PROVIDER", providerName],
    ["PAYMENT_PROVIDER_PUBLIC_KEY", process.env.PAYMENT_PROVIDER_PUBLIC_KEY?.trim()],
    ["PAYMENT_PROVIDER_SECRET_KEY", process.env.PAYMENT_PROVIDER_SECRET_KEY?.trim()],
    ["PAYMENT_WEBHOOK_SECRET", process.env.PAYMENT_WEBHOOK_SECRET?.trim()],
  ] as const;

  const missing = required
    .filter(([, value]) => !value)
    .map(([name]) => name);

  return {
    providerName,
    configured: missing.length === 0,
    missing,
  };
}

export function requirePaymentGatewayAdapter(): never {
  const config = getPaymentProviderConfiguration();
  throw new Error(
    config.configured
      ? "A payment provider is configured but no production adapter has been activated yet."
      : `Payment provider is not configured. Missing: ${config.missing.join(", ")}.`,
  );
}
