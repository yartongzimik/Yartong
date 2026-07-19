import {
  PaymentEventStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

const ALLOWED_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: [
    PaymentStatus.PENDING,
    PaymentStatus.REQUIRES_ACTION,
    PaymentStatus.PROCESSING,
    PaymentStatus.SUCCEEDED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ],
  PENDING: [
    PaymentStatus.REQUIRES_ACTION,
    PaymentStatus.PROCESSING,
    PaymentStatus.SUCCEEDED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ],
  REQUIRES_ACTION: [
    PaymentStatus.PENDING,
    PaymentStatus.PROCESSING,
    PaymentStatus.SUCCEEDED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ],
  PROCESSING: [
    PaymentStatus.SUCCEEDED,
    PaymentStatus.FAILED,
  ],
  SUCCEEDED: [
    PaymentStatus.PARTIALLY_REFUNDED,
    PaymentStatus.REFUNDED,
  ],
  FAILED: [],
  CANCELLED: [],
  PARTIALLY_REFUNDED: [PaymentStatus.REFUNDED],
  REFUNDED: [],
};

export type TrustedPaymentProviderEvent = {
  providerName: string;
  providerEventId: string;
  eventType: string;
  payload: Prisma.InputJsonValue;
  paymentOrderId?: string | null;
  nextStatus?: PaymentStatus | null;
  providerPaymentRef?: string | null;
  failureCode?: string | null;
  failureMessage?: string | null;
};

export async function recordTrustedPaymentProviderEvent(
  input: TrustedPaymentProviderEvent,
) {
  return prisma.$transaction(async (tx) => {
    try {
      const event = await tx.paymentEvent.create({
        data: {
          paymentOrderId: input.paymentOrderId ?? null,
          providerName: input.providerName,
          providerEventId: input.providerEventId,
          eventType: input.eventType,
          payload: input.payload,
        },
      });

      if (!input.paymentOrderId || !input.nextStatus) {
        return tx.paymentEvent.update({
          where: { id: event.id },
          data: {
            status: PaymentEventStatus.IGNORED,
            processedAt: new Date(),
          },
        });
      }

      const order = await tx.paymentOrder.findUnique({
        where: { id: input.paymentOrderId },
        select: { id: true, status: true },
      });

      if (!order || !ALLOWED_PAYMENT_TRANSITIONS[order.status].includes(input.nextStatus)) {
        return tx.paymentEvent.update({
          where: { id: event.id },
          data: {
            status: PaymentEventStatus.IGNORED,
            processedAt: new Date(),
            errorMessage: order
              ? `Ignored invalid payment transition ${order.status} -> ${input.nextStatus}.`
              : "Payment order not found.",
          },
        });
      }

      const now = new Date();
      const updated = await tx.paymentOrder.updateMany({
        where: { id: order.id, status: order.status },
        data: {
          status: input.nextStatus,
          providerName: input.providerName,
          providerPaymentRef: input.providerPaymentRef ?? undefined,
          failureCode: input.failureCode ?? undefined,
          failureMessage: input.failureMessage ?? undefined,
          authorizedAt:
            input.nextStatus === PaymentStatus.PROCESSING ? now : undefined,
          paidAt:
            input.nextStatus === PaymentStatus.SUCCEEDED ? now : undefined,
          cancelledAt:
            input.nextStatus === PaymentStatus.CANCELLED ? now : undefined,
        },
      });

      if (updated.count !== 1) {
        return tx.paymentEvent.update({
          where: { id: event.id },
          data: {
            status: PaymentEventStatus.IGNORED,
            processedAt: now,
            errorMessage: "Payment order changed concurrently; event was not applied.",
          },
        });
      }

      return tx.paymentEvent.update({
        where: { id: event.id },
        data: {
          status: PaymentEventStatus.PROCESSED,
          processedAt: now,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return tx.paymentEvent.findUnique({
          where: {
            providerName_providerEventId: {
              providerName: input.providerName,
              providerEventId: input.providerEventId,
            },
          },
        });
      }
      throw error;
    }
  });
}
