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

function positiveNumber(formData: FormData, key: string, fallback?: number) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw && fallback !== undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${key} must be greater than zero.`);
  return value;
}

export async function createListingForExistingVariantAction(formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const variantId = text(formData, "variantId", 120, true);
  const sellerSku = text(formData, "sellerSku", 160, true);
  const price = Math.round(positiveNumber(formData, "price") * 100);
  const minOrderQty = positiveNumber(formData, "minOrderQty", 1);
  const deliveryAvailable = formData.get("deliveryAvailable") === "on";
  const leadTimeRaw = text(formData, "leadTimeDays", 20);
  const leadTimeDays = leadTimeRaw ? Number(leadTimeRaw) : null;
  if (leadTimeDays !== null && (!Number.isInteger(leadTimeDays) || leadTimeDays < 0)) {
    throw new Error("Lead time must be a non-negative whole number of days.");
  }

  const variants = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT v."id"
    FROM "CatalogVariant" v
    JOIN "CatalogProduct" p ON p."id" = v."productId"
    WHERE v."id" = ${variantId}
      AND v."status" = 'ACTIVE'::"CatalogVariantStatus"
      AND p."status" = 'ACTIVE'::"CatalogProductStatus"
    LIMIT 1
  `);
  if (!variants.length) throw new Error("The selected catalog variant is not available.");

  const existing = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT "id" FROM "SupplierListing"
    WHERE "supplierId" = ${supplier.id} AND "variantId" = ${variantId}
    LIMIT 1
  `);
  if (existing.length) throw new Error("You already have a listing for this catalog variant.");

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "SupplierListing" (
      "id", "supplierId", "variantId", "sellerSku", "currency", "price", "minOrderQty",
      "deliveryAvailable", "leadTimeDays", "status", "updatedAt"
    ) VALUES (
      ${randomUUID()}, ${supplier.id}, ${variantId}, ${sellerSku}, 'INR', ${price}, ${minOrderQty},
      ${deliveryAvailable}, ${leadTimeDays}, 'ACTIVE'::"SupplierListingStatus", CURRENT_TIMESTAMP
    )
  `);

  revalidatePath("/supplier/products");
  revalidatePath("/supplier/inventory");
  revalidatePath("/materials");
}
