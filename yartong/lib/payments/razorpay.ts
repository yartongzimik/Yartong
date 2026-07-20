import type { PaymentCheckoutRequest, PaymentCheckoutResult, PaymentGatewayAdapter } from "./provider";

type RazorpayOrderResponse = {
  id: string;
  status: string;
};

function requireCredential(name: "PAYMENT_PROVIDER_PUBLIC_KEY" | "PAYMENT_PROVIDER_SECRET_KEY") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for Razorpay payments.`);
  return value;
}

export const razorpayGatewayAdapter: PaymentGatewayAdapter = {
  providerName: "razorpay",
  async createCheckout(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResult> {
    const keyId = requireCredential("PAYMENT_PROVIDER_PUBLIC_KEY");
    const keySecret = requireCredential("PAYMENT_PROVIDER_SECRET_KEY");
    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency.toUpperCase(),
        receipt: request.paymentOrderId.slice(0, 40),
        notes: {
          yartong_payment_order_id: request.paymentOrderId,
          yartong_engagement_id: request.engagementId,
          yartong_customer_id: request.customerId,
          idempotency_key: request.idempotencyKey,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Razorpay order creation failed (${response.status}): ${detail.slice(0, 500)}`);
    }

    const order = (await response.json()) as RazorpayOrderResponse;
    if (!order.id) throw new Error("Razorpay did not return an order id.");

    return {
      providerPaymentRef: order.id,
      status: "REQUIRES_ACTION",
    };
  },
};
