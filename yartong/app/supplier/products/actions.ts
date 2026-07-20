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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "item";
}

export async function createSupplierListingAction(formData: FormData): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const categoryId = text(formData, "categoryId", 120, true);
  const productName = text(formData, "productName", 240, true);
  const productDescription = text(formData, "productDescription", 6000);
  const brandName = text(formData, "brandName", 160);
  const manufacturerPartNumber = text(formData, "manufacturerPartNumber", 160);
  const variantName = text(formData, "variantName", 240, true);
  const gtin = text(formData, "gtin", 32);
  const unitName = text(formData, "unitName", 80, true);
  const unitQuantity = positiveNumber(formData, "unitQuantity", 1);
  const sellerSku = text(formData, "sellerSku", 160, true);
  const priceRupees = positiveNumber(formData, "price");
  const price = Math.round(priceRupees * 100);
  const minOrderQty = positiveNumber(formData, "minOrderQty", 1);
  const deliveryAvailable = formData.get("deliveryAvailable") === "on";
  const leadTimeRaw = String(formData.get("leadTimeDays") ?? "").trim();
  const leadTimeDays = leadTimeRaw ? Number(leadTimeRaw) : null;
  if (leadTimeDays !== null && (!Number.isInteger(leadTimeDays) || leadTimeDays < 0)) throw new Error("Lead time must be a non-negative whole number of days.");

  const productId = randomUUID();
  const variantId = randomUUID();
  const listingId = randomUUID();
  const productSlug = `${slugify(productName)}-${productId.slice(0, 8)}`;
  const variantSku = `YV-${variantId.replaceAll("-", "").slice(0, 16).toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    const categories = await tx.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "CatalogCategory" WHERE "id" = ${categoryId} AND "isActive" = true LIMIT 1
    `);
    if (!categories.length) throw new Error("Select an active catalog category.");

    let brandId: string | null = null;
    if (brandName) {
      const brandSlug = slugify(brandName);
      const existing = await tx.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT "id" FROM "CatalogBrand" WHERE "slug" = ${brandSlug} LIMIT 1
      `);
      if (existing[0]) {
        brandId = existing[0].id;
      } else {
        brandId = randomUUID();
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO "CatalogBrand" ("id", "slug", "name", "updatedAt")
          VALUES (${brandId}, ${brandSlug}, ${brandName}, CURRENT_TIMESTAMP)
        `);
      }
    }

    if (gtin) {
      const duplicateGtin = await tx.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT "id" FROM "CatalogVariant" WHERE "gtin" = ${gtin} LIMIT 1
      `);
      if (duplicateGtin.length) throw new Error("A catalog variant with this GTIN/barcode already exists. Add a supplier listing to the existing product instead of creating a duplicate.");
    }

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "CatalogProduct" (
        "id", "categoryId", "brandId", "createdBySupplierId", "slug", "name", "description",
        "manufacturerPartNumber", "attributes", "status", "source", "updatedAt"
      ) VALUES (
        ${productId}, ${categoryId}, ${brandId}, ${supplier.id}, ${productSlug}, ${productName}, ${productDescription || null},
        ${manufacturerPartNumber || null}, '{}'::jsonb, 'ACTIVE'::"CatalogProductStatus", 'SUPPLIER_SUBMITTED'::"CatalogProductSource", CURRENT_TIMESTAMP
      )
    `);

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "CatalogVariant" (
        "id", "productId", "sku", "name", "gtin", "unitName", "unitQuantity", "attributes", "status", "updatedAt"
      ) VALUES (
        ${variantId}, ${productId}, ${variantSku}, ${variantName}, ${gtin || null}, ${unitName}, ${unitQuantity}, '{}'::jsonb, 'ACTIVE'::"CatalogVariantStatus", CURRENT_TIMESTAMP
      )
    `);

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "SupplierListing" (
        "id", "supplierId", "variantId", "sellerSku", "currency", "price", "minOrderQty",
        "deliveryAvailable", "leadTimeDays", "status", "updatedAt"
      ) VALUES (
        ${listingId}, ${supplier.id}, ${variantId}, ${sellerSku}, 'INR', ${price}, ${minOrderQty},
        ${deliveryAvailable}, ${leadTimeDays}, 'ACTIVE'::"SupplierListingStatus", CURRENT_TIMESTAMP
      )
    `);
  }, { isolationLevel: "Serializable" });

  revalidatePath("/supplier/products");
  revalidatePath("/supplier/inventory");
  revalidatePath("/materials");
  revalidatePath(`/materials/${productId}`);
}

export async function setSupplierListingStatusAction(listingId: string, nextStatus: "ACTIVE" | "PAUSED"): Promise<void> {
  const supplier = await requireRole("MATERIAL_SUPPLIER");
  const changed = await prisma.$executeRaw(Prisma.sql`
    UPDATE "SupplierListing"
    SET "status" = ${nextStatus}::"SupplierListingStatus", "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = ${listingId} AND "supplierId" = ${supplier.id}
      AND "status" IN ('ACTIVE'::"SupplierListingStatus", 'PAUSED'::"SupplierListingStatus")
  `);
  if (changed !== 1) throw new Error("This listing could not be updated.");
  revalidatePath("/supplier/products");
  revalidatePath("/materials");
}
