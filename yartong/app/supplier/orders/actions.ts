"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { createNotificationWithTx } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const TRANSITIONS: Record<string, { from: string[]; event: string; title: string }> = {
  ACCEPTED: { from: ["PLACED"], event: "ACCEPTED", title: "Material order accepted" },
  PREPARING: { from: ["ACCEPTED"], event: "PREPARING", title: "Material order is being prepared" },
  READY: { from: ["PREPARING"], event: "READY", title: "Material order is ready" },
};

function refresh(orderId: string) {
  revalidatePath("/supplier/orders");
  revalidatePath(`/supplier/orders/${orderId}`);
  revalidatePath(`/customer/material-orders/${orderId}`);
  revalidatePath("/customer/material-orders");
  revalidatePath("/notifications");
  revalidatePath("/materials");
}

export async function transitionMaterialOrderAction(orderId: string, nextStatus: "ACCEPTED" | "PREPARING" | "READY"): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const rule = TRANSITIONS[nextStatus];

  await prisma.$transaction(async (tx) => {
    const orders = await tx.$queryRaw<Array<{ customerId: string; orderNumber: string }>>(Prisma.sql`
      SELECT "customerId", "orderNumber"
      FROM "MaterialOrder"
      WHERE "id" = ${orderId} AND "supplierId" = ${supplier.id}
        AND "status"::text IN (${Prisma.join(rule.from)})
      FOR UPDATE
    `);
    const order = orders[0];
    if (!order) throw new Error("This order can no longer move to that status.");

    const changed = await tx.$executeRaw(Prisma.sql`
      UPDATE "MaterialOrder"
      SET "status" = ${nextStatus}::"MaterialOrderStatus", "updatedAt" = CURRENT_TIMESTAMP,
          "acceptedAt" = CASE WHEN ${nextStatus} = 'ACCEPTED' THEN CURRENT_TIMESTAMP ELSE "acceptedAt" END,
          "readyAt" = CASE WHEN ${nextStatus} = 'READY' THEN CURRENT_TIMESTAMP ELSE "readyAt" END
      WHERE "id" = ${orderId} AND "supplierId" = ${supplier.id}
        AND "status"::text IN (${Prisma.join(rule.from)})
    `);
    if (changed !== 1) throw new Error("This order can no longer move to that status.");

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
      VALUES (${randomUUID()}, ${orderId}, ${supplier.id}, ${rule.event}::"MaterialOrderEventType", NULL)
    `);
    await createNotificationWithTx(tx, {
      userId: order.customerId,
      type: "ORDER",
      title: rule.title,
      body: `Order ${order.orderNumber} is now ${nextStatus.toLowerCase().replaceAll("_", " ")}.`,
      href: `/customer/material-orders/${orderId}`,
    });
  }, { isolationLevel: "Serializable" });

  refresh(orderId);
}

export async function rejectMaterialOrderAction(orderId: string, formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const note = String(formData.get("note") ?? "").trim().slice(0, 2000) || "Order rejected by supplier.";

  await prisma.$transaction(async (tx) => {
    const items = await tx.$queryRaw<Array<{ stockId: string; quantity: string; customerId: string; orderNumber: string }>>(Prisma.sql`
      SELECT i."stockId", i."quantity"::text AS "quantity", o."customerId", o."orderNumber"
      FROM "MaterialOrder" o JOIN "MaterialOrderItem" i ON i."orderId" = o."id"
      WHERE o."id" = ${orderId} AND o."supplierId" = ${supplier.id} AND o."status" = 'PLACED'::"MaterialOrderStatus"
      FOR UPDATE OF o
    `);
    if (!items.length) throw new Error("This order can no longer be rejected.");

    for (const item of items) {
      const quantity = Number(item.quantity);
      await tx.$executeRaw(Prisma.sql`
        UPDATE "InventoryStock" SET "reserved" = "reserved" - ${quantity}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${item.stockId} AND "reserved" >= ${quantity}
      `);
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "InventoryMovement" ("id", "stockId", "actorId", "type", "reservedDelta", "reason", "reference")
        VALUES (${randomUUID()}, ${item.stockId}, ${supplier.id}, 'RELEASE'::"InventoryMovementType", ${-quantity}, 'Reservation released after supplier rejection', ${orderId})
      `);
    }

    await tx.$executeRaw(Prisma.sql`
      UPDATE "MaterialOrder" SET "status" = 'REJECTED'::"MaterialOrderStatus", "supplierNote" = ${note}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${orderId} AND "supplierId" = ${supplier.id} AND "status" = 'PLACED'::"MaterialOrderStatus"
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
      VALUES (${randomUUID()}, ${orderId}, ${supplier.id}, 'REJECTED'::"MaterialOrderEventType", ${note})
    `);
    await createNotificationWithTx(tx, {
      userId: items[0].customerId,
      type: "ORDER",
      title: "Material order rejected",
      body: `Order ${items[0].orderNumber} could not be accepted. Reserved inventory has been released.`,
      href: `/customer/material-orders/${orderId}`,
    });
  }, { isolationLevel: "Serializable" });
  refresh(orderId);
}

export async function fulfillMaterialOrderAction(orderId: string): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  await prisma.$transaction(async (tx) => {
    const items = await tx.$queryRaw<Array<{ stockId: string; quantity: string; customerId: string; orderNumber: string }>>(Prisma.sql`
      SELECT i."stockId", i."quantity"::text AS "quantity", o."customerId", o."orderNumber"
      FROM "MaterialOrder" o JOIN "MaterialOrderItem" i ON i."orderId" = o."id"
      WHERE o."id" = ${orderId} AND o."supplierId" = ${supplier.id} AND o."status" = 'READY'::"MaterialOrderStatus"
      FOR UPDATE OF o
    `);
    if (!items.length) throw new Error("This order is not ready for fulfillment.");

    for (const item of items) {
      const quantity = Number(item.quantity);
      const changed = await tx.$executeRaw(Prisma.sql`
        UPDATE "InventoryStock"
        SET "onHand" = "onHand" - ${quantity}, "reserved" = "reserved" - ${quantity}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${item.stockId} AND "onHand" >= ${quantity} AND "reserved" >= ${quantity}
      `);
      if (changed !== 1) throw new Error("Reserved stock is inconsistent and fulfillment was stopped safely.");
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "InventoryMovement" ("id", "stockId", "actorId", "type", "onHandDelta", "reservedDelta", "reason", "reference")
        VALUES (${randomUUID()}, ${item.stockId}, ${supplier.id}, 'SALE'::"InventoryMovementType", ${-quantity}, ${-quantity}, 'Material order fulfilled', ${orderId})
      `);
    }

    await tx.$executeRaw(Prisma.sql`
      UPDATE "MaterialOrder" SET "status" = 'FULFILLED'::"MaterialOrderStatus", "fulfilledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${orderId} AND "supplierId" = ${supplier.id} AND "status" = 'READY'::"MaterialOrderStatus"
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
      VALUES (${randomUUID()}, ${orderId}, ${supplier.id}, 'FULFILLED'::"MaterialOrderEventType", 'Order fulfilled; reserved stock converted to inventory outflow.')
    `);
    await createNotificationWithTx(tx, {
      userId: items[0].customerId,
      type: "ORDER",
      title: "Material order fulfilled",
      body: `Order ${items[0].orderNumber} has been marked fulfilled.`,
      href: `/customer/material-orders/${orderId}`,
    });
  }, { isolationLevel: "Serializable" });
  refresh(orderId);
}
