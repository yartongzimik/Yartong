"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const TRANSITIONS: Record<string, { from: string[]; event: string }> = {
  ACCEPTED: { from: ["PLACED"], event: "ACCEPTED" },
  PREPARING: { from: ["ACCEPTED"], event: "PREPARING" },
  READY: { from: ["PREPARING"], event: "READY" },
};

function refresh(orderId: string) {
  revalidatePath("/supplier/orders");
  revalidatePath(`/supplier/orders/${orderId}`);
  revalidatePath(`/customer/material-orders/${orderId}`);
  revalidatePath("/customer/material-orders");
  revalidatePath("/materials");
}

export async function transitionMaterialOrderAction(orderId: string, nextStatus: "ACCEPTED" | "PREPARING" | "READY"): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const rule = TRANSITIONS[nextStatus];
  const changed = await prisma.$executeRaw(Prisma.sql`
    UPDATE "MaterialOrder"
    SET "status" = ${nextStatus}::"MaterialOrderStatus", "updatedAt" = CURRENT_TIMESTAMP,
        "acceptedAt" = CASE WHEN ${nextStatus} = 'ACCEPTED' THEN CURRENT_TIMESTAMP ELSE "acceptedAt" END,
        "readyAt" = CASE WHEN ${nextStatus} = 'READY' THEN CURRENT_TIMESTAMP ELSE "readyAt" END
    WHERE "id" = ${orderId} AND "supplierId" = ${supplier.id}
      AND "status"::text IN (${Prisma.join(rule.from)})
  `);
  if (changed !== 1) throw new Error("This order can no longer move to that status.");
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
    VALUES (${randomUUID()}, ${orderId}, ${supplier.id}, ${rule.event}::"MaterialOrderEventType", NULL)
  `);
  refresh(orderId);
}

export async function rejectMaterialOrderAction(orderId: string, formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const note = String(formData.get("note") ?? "").trim().slice(0, 2000) || "Order rejected by supplier.";

  await prisma.$transaction(async (tx) => {
    const items = await tx.$queryRaw<Array<{ stockId: string; quantity: string }>>(Prisma.sql`
      SELECT i."stockId", i."quantity"::text AS "quantity"
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
  }, { isolationLevel: "Serializable" });
  refresh(orderId);
}

export async function fulfillMaterialOrderAction(orderId: string): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  await prisma.$transaction(async (tx) => {
    const items = await tx.$queryRaw<Array<{ stockId: string; quantity: string }>>(Prisma.sql`
      SELECT i."stockId", i."quantity"::text AS "quantity"
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
  }, { isolationLevel: "Serializable" });
  refresh(orderId);
}
