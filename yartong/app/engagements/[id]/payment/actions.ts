"use server";

import { EngagementStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
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
      where: {
        id: engagementId,
        customerId: user.id,
        status: { in: PAYABLE_ENGAGEMENT_STATUSES },
      },
      select: {
        id: true,
        customerId: true,
        providerId: true,
        agreedPrice: true,
        currency: true,
      },
    });

    if (!engagement || !engagement.agreedPrice || engagement.agreedPrice <= 0) {
      throw new Error("This engagement does not have payable agreed terms.");
    }

    const idempotencyKey = `engagement:${engagement.id}:payment`;
    const existing = await tx.paymentOrder.findUnique({
      where: { engagementId: engagement.id },
      select: { id: true, status: true },
    });

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

export async function cancelPreparedPaymentOrderAction(engagementId: string): Promise<void> {
  const user = await requireUser();
  const result = await prisma.paymentOrder.updateMany({
    where: {
      engagementId,
      customerId: user.id,
      status: PaymentStatus.CREATED,
    },
    data: {
      status: PaymentStatus.CANCELLED,
      cancelledAt: new Date(),
    },
  });

  if (result.count !== 1) {
    throw new Error("This payment order can no longer be cancelled.");
  }

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/payment`);
}
