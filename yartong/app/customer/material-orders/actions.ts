"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function cancelPlacedMaterialOrderAction(orderId: string): Promise<void> {
  const customer = await requireRole("CUSTOMER");

  await prisma.$transaction(async (tx) => {
    const items = await tx.$queryRaw<Array<{ stockId: string; quantity: string }>>(Prisma.sql`
      SELECT i."stockId", i."quantity"::text AS "quantity"
      FROM "MaterialOrder" o
      JOIN "MaterialOrderItem" i ON i."orderId" = o."id"
      WHERE o."id" = ${orderId} AND o."customerId" = ${customer.id}
        AND o."status" = 'PLACED'::"MaterialOrderStatus"
      FOR UPDATE OF o
    `);
    if (!items.length) throw new Error("This order can no longer be cancelled by the customer.");

    for (const item of items) {
      const quantity = Number(item.quantity);
      const changed = await tx.$executeRaw(Prisma.sql`
        UPDATE "InventoryStock"
        SET "reserved" = "reserved" - ${quantity}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${item.stockId} AND "reserved" >= ${quantity}
      `);
      if (changed !== 1) throw new Error("Reservation state is inconsistent; cancellation was stopped safely.");
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "InventoryMovement" ("id", "stockId", "actorId", "type", "reservedDelta", "reason", "reference")
        VALUES (${randomUUID()}, ${item.stockId}, ${customer.id}, 'RELEASE'::"InventoryMovementType", ${-quantity}, 'Reservation released after customer cancellation', ${orderId})
      `);
    }

    await tx.$executeRaw(Prisma.sql`
      UPDATE "MaterialOrder"
      SET "status" = 'CANCELLED'::"MaterialOrderStatus", "cancelledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${orderId} AND "customerId" = ${customer.id} AND "status" = 'PLACED'::"MaterialOrderStatus"
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
      VALUES (${randomUUID()}, ${orderId}, ${customer.id}, 'CANCELLED'::"MaterialOrderEventType", 'Customer cancelled before supplier acceptance; inventory reservation released.')
    `);
  }, { isolationLevel: "Serializable" });

  revalidatePath("/customer/material-orders");
  revalidatePath(`/customer/material-orders/${orderId}`);
  revalidatePath("/supplier/orders");
  revalidatePath("/materials");
}
