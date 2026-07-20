"use server";

import { EngagementStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { requirePaymentGatewayAdapter } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

const PAYABLE_ENGAGEMENT_STATUSES: EngagementStatus[] = [
  EngagementStatus.CONFIRMED,
  EngagementStatus.IN_PROGRESS,
  EngagementStatus.COMPLETED,
];

export async function preparePaymentOrderAction(engagementId: string): Promise<void> {
  const user = await requireUser();

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findFirst({
      where: { id: engagementId, customerId: user.id, status: { in: PAYABLE_ENGAGEMENT_STATUSES } },
      select: { id: true, customerId: true, providerId: true, agreedPrice: true, currency: true },
    });

    if (!engagement || !engagement.agreedPrice || engagement.agreedPrice <= 0) {
      throw new Error("This engagement does not have payable agreed terms.");
    }

    const idempotencyKey = `engagement:${engagement.id}:payment`;
    const existing = await tx.paymentOrder.findUnique({ where: { engagementId: engagement.id }, select: { id: true, status: true } });

    if (existing) {
      if (existing.status === PaymentStatus.CANCELLED || existing.status === PaymentStatus.FAILED) {
        await tx.paymentOrder.update({
          where: { id: existing.id },
          data: {
            amount: engagement.agreedPrice,
            currency: engagement.currency,
            status: PaymentStatus.CREATED,
            providerName: null,
            providerPaymentRef: null,
            failureCode: null,
            failureMessage: null,
            cancelledAt: null,
          },
        });
      }
      return;
    }

    await tx.paymentOrder.create({
      data: {
        engagementId: engagement.id,
        customerId: engagement.customerId,
        providerId: engagement.providerId,
        amount: engagement.agreedPrice,
        currency: engagement.currency,
        idempotencyKey,
      },
    });
  }, { isolationLevel: "Serializable" });

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/payment`);
}

export type CheckoutStartResult = {
  keyId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  paymentOrderId: string;
};

export async function startPaymentCheckoutAction(engagementId: string): Promise<CheckoutStartResult> {
  const user = await requireUser();
  const order = await prisma.paymentOrder.findFirst({
    where: {
      engagementId,
      customerId: user.id,
      status: { in: [PaymentStatus.CREATED, PaymentStatus.REQUIRES_ACTION] },
    },
    select: {
      id: true,
      amount: true,
      currency: true,
      idempotencyKey: true,
      customerId: true,
      engagementId: true,
      providerName: true,
      providerPaymentRef: true,
    },
  });

  if (!order) throw new Error("Prepare a valid payment order before starting checkout.");
  const gateway = await requirePaymentGatewayAdapter();

  let providerOrderId = order.providerPaymentRef;
  if (!providerOrderId || order.providerName !== gateway.providerName) {
    const checkout = await gateway.createCheckout({
      paymentOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      idempotencyKey: order.idempotencyKey,
      customerId: order.customerId,
      engagementId: order.engagementId,
    });
    providerOrderId = checkout.providerPaymentRef;
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        providerName: gateway.providerName,
        providerPaymentRef: providerOrderId,
        status: PaymentStatus.REQUIRES_ACTION,
        failureCode: null,
        failureMessage: null,
      },
    });
  }

  const keyId = process.env.PAYMENT_PROVIDER_PUBLIC_KEY?.trim();
  if (!keyId || !providerOrderId) throw new Error("Razorpay checkout is not fully configured.");

  revalidatePath(`/engagements/${engagementId}/payment`);
  return { keyId, providerOrderId, amount: order.amount, currency: order.currency, paymentOrderId: order.id };
}

export async function cancelPreparedPaymentOrderAction(engagementId: string): Promise<void> {
  const user = await requireUser();
  const result = await prisma.paymentOrder.updateMany({
    where: { engagementId, customerId: user.id, status: PaymentStatus.CREATED },
    data: { status: PaymentStatus.CANCELLED, cancelledAt: new Date() },
  });

  if (result.count !== 1) throw new Error("This payment order can no longer be cancelled.");
  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/payment`);
}
