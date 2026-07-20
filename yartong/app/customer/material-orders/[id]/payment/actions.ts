"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { enforceMutationRateLimit } from "@/lib/rate-limit";

export async function prepareMaterialPaymentOrderAction(orderId: string): Promise<void> {
  const customer = await requireRole("CUSTOMER");
  await enforceMutationRateLimit({ actorId: customer.id, action: "prepare-material-payment", limit: 10, windowSeconds: 300 });

  await prisma.$transaction(async (tx) => {
    const orders = await tx.$queryRaw<Array<{
      id: string;
      customerId: string;
      supplierId: string;
      subtotal: number;
      currency: string;
      status: string;
    }>>(Prisma.sql`
      SELECT "id", "customerId", "supplierId", "subtotal", "currency", "status"::text AS "status"
      FROM "MaterialOrder"
      WHERE "id" = ${orderId} AND "customerId" = ${customer.id}
      FOR UPDATE
      LIMIT 1
    `);
    const order = orders[0];
    if (!order || ["REJECTED", "CANCELLED"].includes(order.status) || order.subtotal <= 0) {
      throw new Error("This material order is not eligible for payment preparation.");
    }

    const existing = await tx.$queryRaw<Array<{ id: string; status: string }>>(Prisma.sql`
      SELECT "id", "status"::text AS "status"
      FROM "MaterialPaymentOrder"
      WHERE "materialOrderId" = ${orderId}
      FOR UPDATE
      LIMIT 1
    `);

    if (existing[0]) {
      if (["FAILED", "CANCELLED"].includes(existing[0].status)) {
        await tx.$executeRaw(Prisma.sql`
          UPDATE "MaterialPaymentOrder"
          SET "amount" = ${order.subtotal}, "currency" = ${order.currency},
              "status" = 'CREATED'::"PaymentStatus", "providerName" = NULL,
              "providerPaymentRef" = NULL, "failureCode" = NULL, "failureMessage" = NULL,
              "cancelledAt" = NULL, "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = ${existing[0].id}
        `);
      }
      return;
    }

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialPaymentOrder" (
        "id", "materialOrderId", "customerId", "supplierId", "amount", "currency", "idempotencyKey"
      ) VALUES (
        ${randomUUID()}, ${order.id}, ${order.customerId}, ${order.supplierId}, ${order.subtotal},
        ${order.currency}, ${`material-order:${order.id}:payment`}
      )
    `);
  }, { isolationLevel: "Serializable" });

  revalidatePath(`/customer/material-orders/${orderId}`);
  revalidatePath(`/customer/material-orders/${orderId}/payment`);
}

export async function cancelMaterialPaymentOrderAction(orderId: string): Promise<void> {
  const customer = await requireRole("CUSTOMER");
  const changed = await prisma.$executeRaw(Prisma.sql`
    UPDATE "MaterialPaymentOrder"
    SET "status" = 'CANCELLED'::"PaymentStatus", "cancelledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "materialOrderId" = ${orderId} AND "customerId" = ${customer.id}
      AND "status" = 'CREATED'::"PaymentStatus"
  `);
  if (changed !== 1) throw new Error("This prepared payment can no longer be cancelled.");

  revalidatePath(`/customer/material-orders/${orderId}`);
  revalidatePath(`/customer/material-orders/${orderId}/payment`);
}
