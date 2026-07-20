import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { PaymentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { recordTrustedPaymentProviderEvent } from "@/lib/payments/events";
import { prisma } from "@/lib/prisma";

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

function getEntity(payload: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const bodyPayload = payload.payload;
  if (!bodyPayload || typeof bodyPayload !== "object") return null;
  const wrapper = (bodyPayload as Record<string, unknown>)[key];
  if (!wrapper || typeof wrapper !== "object") return null;
  const entity = (wrapper as Record<string, unknown>).entity;
  return entity && typeof entity === "object" ? entity as Record<string, unknown> : null;
}

export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  if (!signature || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const eventType = String(payload.event || "unknown");
  const paymentEntity = getEntity(payload, "payment");
  const orderEntity = getEntity(payload, "order");
  const providerOrderId = String(orderEntity?.id || paymentEntity?.order_id || "");
  const providerPaymentId = String(paymentEntity?.id || "") || null;
  const eventId = request.headers.get("x-razorpay-event-id") || createHash("sha256").update(rawBody).digest("hex");

  const paymentOrder = providerOrderId
    ? await prisma.paymentOrder.findFirst({ where: { providerName: "razorpay", providerPaymentRef: providerOrderId }, select: { id: true } })
    : null;

  let nextStatus: PaymentStatus | null = null;
  if (eventType === "order.paid" || eventType === "payment.captured") nextStatus = PaymentStatus.SUCCEEDED;
  if (eventType === "payment.authorized") nextStatus = PaymentStatus.PROCESSING;
  if (eventType === "payment.failed") nextStatus = PaymentStatus.FAILED;
  if (eventType === "refund.processed" || eventType === "refund.created") nextStatus = PaymentStatus.REFUNDED;

  const errorCode = paymentEntity?.error_code ? String(paymentEntity.error_code) : null;
  const errorDescription = paymentEntity?.error_description ? String(paymentEntity.error_description) : null;

  await recordTrustedPaymentProviderEvent({
    providerName: "razorpay",
    providerEventId: eventId,
    eventType,
    payload: payload as Prisma.InputJsonValue,
    paymentOrderId: paymentOrder?.id ?? null,
    nextStatus,
    providerPaymentRef: providerPaymentId ?? providerOrderId ?? null,
    failureCode: errorCode,
    failureMessage: errorDescription,
  });

  return NextResponse.json({ received: true });
}
