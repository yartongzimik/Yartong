"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

function text(formData: FormData, key: string, max: number, required = false) {
  const value = String(formData.get(key) ?? "").trim();
  if (required && !value) throw new Error(`${key} is required.`);
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value;
}

export async function createInventoryLocationAction(formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const name = text(formData, "name", 160, true);
  const addressLine = text(formData, "addressLine", 500);
  const locationIdRaw = text(formData, "locationId", 120);
  const locationId = locationIdRaw || null;

  if (locationId) {
    const location = await prisma.location.findFirst({ where: { id: locationId, isActive: true }, select: { id: true } });
    if (!location) throw new Error("Select an active Yartong service location.");
  }

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "InventoryLocation" ("id", "supplierId", "locationId", "name", "addressLine", "isActive", "updatedAt")
    VALUES (${randomUUID()}, ${supplier.id}, ${locationId}, ${name}, ${addressLine || null}, true, CURRENT_TIMESTAMP)
  `);

  revalidatePath("/supplier/inventory");
}

export async function setInventoryStockAction(formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const listingId = text(formData, "listingId", 120, true);
  const inventoryLocationId = text(formData, "inventoryLocationId", 120, true);
  const onHand = Number(text(formData, "onHand", 40, true));
  const reorderRaw = text(formData, "reorderPoint", 40);
  const reorderPoint = reorderRaw ? Number(reorderRaw) : null;
  const reason = text(formData, "reason", 1000);

  if (!Number.isFinite(onHand) || onHand < 0) throw new Error("On-hand quantity must be zero or greater.");
  if (reorderPoint !== null && (!Number.isFinite(reorderPoint) || reorderPoint < 0)) throw new Error("Reorder point must be zero or greater.");

  await prisma.$transaction(async (tx) => {
    const ownership = await tx.$queryRaw<{ listingId: string; locationId: string }[]>(Prisma.sql`
      SELECT l."id" AS "listingId", il."id" AS "locationId"
      FROM "SupplierListing" l
      CROSS JOIN "InventoryLocation" il
      WHERE l."id" = ${listingId} AND l."supplierId" = ${supplier.id}
        AND il."id" = ${inventoryLocationId} AND il."supplierId" = ${supplier.id} AND il."isActive" = true
      LIMIT 1
    `);
    if (!ownership.length) throw new Error("Listing or inventory location was not found.");

    const existing = await tx.$queryRaw<{ id: string; onHand: string; reserved: string }[]>(Prisma.sql`
      SELECT "id", "onHand"::text AS "onHand", "reserved"::text AS "reserved"
      FROM "InventoryStock"
      WHERE "listingId" = ${listingId} AND "inventoryLocationId" = ${inventoryLocationId}
      FOR UPDATE
    `);

    const current = existing[0];
    const reserved = current ? Number(current.reserved) : 0;
    if (onHand < reserved) throw new Error("On-hand stock cannot be lower than quantity already reserved.");

    const stockId = current?.id ?? randomUUID();
    const previousOnHand = current ? Number(current.onHand) : 0;
    const delta = onHand - previousOnHand;

    if (current) {
      await tx.$executeRaw(Prisma.sql`
        UPDATE "InventoryStock"
        SET "onHand" = ${onHand}, "reorderPoint" = ${reorderPoint}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${stockId}
      `);
    } else {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "InventoryStock" (
          "id", "listingId", "inventoryLocationId", "onHand", "reserved", "reorderPoint", "updatedAt"
        ) VALUES (${stockId}, ${listingId}, ${inventoryLocationId}, ${onHand}, 0, ${reorderPoint}, CURRENT_TIMESTAMP)
      `);
    }

    if (delta !== 0) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "InventoryMovement" (
          "id", "stockId", "actorId", "type", "onHandDelta", "reservedDelta", "reason"
        ) VALUES (
          ${randomUUID()}, ${stockId}, ${supplier.id}, 'ADJUSTMENT'::"InventoryMovementType", ${delta}, 0,
          ${reason || "Manual stock count adjustment"}
        )
      `);
    }
  }, { isolationLevel: "Serializable" });

  revalidatePath("/supplier/inventory");
  revalidatePath("/supplier/products");
  revalidatePath("/materials");
}
