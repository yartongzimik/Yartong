import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
};

export type PublicCatalogCard = {
  productId: string;
  productName: string;
  brandName: string | null;
  categoryName: string;
  variantId: string;
  variantName: string;
  unitName: string;
  unitQuantity: string;
  minPrice: number;
  currency: string;
  listingCount: number;
  availableQty: number;
};

export type PublicListing = {
  listingId: string;
  supplierId: string;
  supplierName: string;
  supplierBusinessName: string | null;
  variantId: string;
  variantName: string;
  sellerSku: string;
  title: string | null;
  currency: string;
  price: number;
  minOrderQty: string;
  deliveryAvailable: boolean;
  leadTimeDays: number | null;
  availableQty: number;
};

export type CatalogProductDetail = {
  id: string;
  name: string;
  description: string | null;
  brandName: string | null;
  categoryName: string;
  manufacturerPartNumber: string | null;
  attributes: unknown;
};

export type SupplierListingRow = {
  listingId: string;
  productId: string;
  productName: string;
  categoryName: string;
  variantId: string;
  variantName: string;
  sku: string;
  sellerSku: string;
  unitName: string;
  unitQuantity: string;
  price: number;
  currency: string;
  minOrderQty: string;
  deliveryAvailable: boolean;
  leadTimeDays: number | null;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  availableQty: number;
};

export type InventoryLocationRow = {
  id: string;
  name: string;
  addressLine: string | null;
  yartongLocationName: string | null;
  isActive: boolean;
};

export type InventoryStockRow = {
  stockId: string;
  listingId: string;
  inventoryLocationId: string;
  locationName: string;
  productName: string;
  variantName: string;
  sellerSku: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number | null;
};

export async function getCatalogCategories() {
  return prisma.$queryRaw<CatalogCategory[]>(Prisma.sql`
    SELECT "id", "slug", "name"
    FROM "CatalogCategory"
    WHERE "isActive" = true
    ORDER BY "sortOrder" ASC, "name" ASC
  `);
}

export async function listPublicCatalog(options: { q?: string; category?: string }) {
  const q = options.q?.trim() ?? "";
  const category = options.category?.trim() ?? "";
  const qFilter = q
    ? Prisma.sql`AND (p."name" ILIKE ${`%${q}%`} OR v."name" ILIKE ${`%${q}%`} OR COALESCE(b."name", '') ILIKE ${`%${q}%`} OR l."sellerSku" ILIKE ${`%${q}%`})`
    : Prisma.empty;
  const categoryFilter = category
    ? Prisma.sql`AND c."slug" = ${category}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<Omit<PublicCatalogCard, "listingCount" | "availableQty"> & { listingCount: bigint; availableQty: string }>>(Prisma.sql`
    SELECT
      p."id" AS "productId",
      p."name" AS "productName",
      b."name" AS "brandName",
      c."name" AS "categoryName",
      v."id" AS "variantId",
      v."name" AS "variantName",
      v."unitName",
      v."unitQuantity"::text AS "unitQuantity",
      MIN(l."price")::integer AS "minPrice",
      MIN(l."currency") AS "currency",
      COUNT(DISTINCT l."id") AS "listingCount",
      COALESCE(SUM(s."onHand" - s."reserved"), 0)::text AS "availableQty"
    FROM "CatalogProduct" p
    JOIN "CatalogCategory" c ON c."id" = p."categoryId"
    LEFT JOIN "CatalogBrand" b ON b."id" = p."brandId"
    JOIN "CatalogVariant" v ON v."productId" = p."id" AND v."status" = 'ACTIVE'::"CatalogVariantStatus"
    JOIN "SupplierListing" l ON l."variantId" = v."id" AND l."status" = 'ACTIVE'::"SupplierListingStatus"
    LEFT JOIN "InventoryStock" s ON s."listingId" = l."id"
    WHERE p."status" = 'ACTIVE'::"CatalogProductStatus"
      ${qFilter}
      ${categoryFilter}
    GROUP BY p."id", p."name", b."name", c."name", v."id", v."name", v."unitName", v."unitQuantity"
    ORDER BY p."name" ASC, v."name" ASC
    LIMIT 200
  `);

  return rows.map((row) => ({
    ...row,
    listingCount: Number(row.listingCount),
    availableQty: Number(row.availableQty),
  }));
}

export async function getPublicCatalogProduct(productId: string) {
  const products = await prisma.$queryRaw<CatalogProductDetail[]>(Prisma.sql`
    SELECT p."id", p."name", p."description", b."name" AS "brandName",
      c."name" AS "categoryName", p."manufacturerPartNumber", p."attributes"
    FROM "CatalogProduct" p
    JOIN "CatalogCategory" c ON c."id" = p."categoryId"
    LEFT JOIN "CatalogBrand" b ON b."id" = p."brandId"
    WHERE p."id" = ${productId} AND p."status" = 'ACTIVE'::"CatalogProductStatus"
    LIMIT 1
  `);
  if (!products[0]) return null;

  const listings = await prisma.$queryRaw<Array<Omit<PublicListing, "availableQty"> & { availableQty: string }>>(Prisma.sql`
    SELECT l."id" AS "listingId", l."supplierId", supplier."displayName" AS "supplierName",
      sp."businessName" AS "supplierBusinessName", v."id" AS "variantId", v."name" AS "variantName",
      l."sellerSku", l."title", l."currency", l."price", l."minOrderQty"::text AS "minOrderQty",
      l."deliveryAvailable", l."leadTimeDays",
      COALESCE(SUM(s."onHand" - s."reserved"), 0)::text AS "availableQty"
    FROM "CatalogVariant" v
    JOIN "SupplierListing" l ON l."variantId" = v."id" AND l."status" = 'ACTIVE'::"SupplierListingStatus"
    JOIN "User" supplier ON supplier."id" = l."supplierId"
    LEFT JOIN "MaterialSupplierProfile" sp ON sp."userId" = supplier."id"
    LEFT JOIN "InventoryStock" s ON s."listingId" = l."id"
    WHERE v."productId" = ${productId} AND v."status" = 'ACTIVE'::"CatalogVariantStatus"
    GROUP BY l."id", l."supplierId", supplier."displayName", sp."businessName", v."id", v."name"
    ORDER BY v."name" ASC, l."price" ASC
  `);

  return {
    product: products[0],
    listings: listings.map((row) => ({ ...row, availableQty: Number(row.availableQty) })),
  };
}

export async function getSupplierListings(supplierId: string) {
  const rows = await prisma.$queryRaw<Array<Omit<SupplierListingRow, "availableQty"> & { availableQty: string }>>(Prisma.sql`
    SELECT l."id" AS "listingId", p."id" AS "productId", p."name" AS "productName", c."name" AS "categoryName",
      v."id" AS "variantId", v."name" AS "variantName", v."sku", l."sellerSku", v."unitName",
      v."unitQuantity"::text AS "unitQuantity", l."price", l."currency", l."minOrderQty"::text AS "minOrderQty",
      l."deliveryAvailable", l."leadTimeDays", l."status"::text AS "status",
      COALESCE(SUM(s."onHand" - s."reserved"), 0)::text AS "availableQty"
    FROM "SupplierListing" l
    JOIN "CatalogVariant" v ON v."id" = l."variantId"
    JOIN "CatalogProduct" p ON p."id" = v."productId"
    JOIN "CatalogCategory" c ON c."id" = p."categoryId"
    LEFT JOIN "InventoryStock" s ON s."listingId" = l."id"
    WHERE l."supplierId" = ${supplierId}
    GROUP BY l."id", p."id", p."name", c."name", v."id", v."name", v."sku"
    ORDER BY l."updatedAt" DESC
  `);
  return rows.map((row) => ({ ...row, availableQty: Number(row.availableQty) }));
}

export async function getSupplierInventoryLocations(supplierId: string) {
  return prisma.$queryRaw<InventoryLocationRow[]>(Prisma.sql`
    SELECT il."id", il."name", il."addressLine", loc."name" AS "yartongLocationName", il."isActive"
    FROM "InventoryLocation" il
    LEFT JOIN "Location" loc ON loc."id" = il."locationId"
    WHERE il."supplierId" = ${supplierId}
    ORDER BY il."isActive" DESC, il."name" ASC
  `);
}

export async function getSupplierInventoryStocks(supplierId: string) {
  const rows = await prisma.$queryRaw<Array<Omit<InventoryStockRow, "onHand" | "reserved" | "available" | "reorderPoint"> & { onHand: string; reserved: string; available: string; reorderPoint: string | null }>>(Prisma.sql`
    SELECT s."id" AS "stockId", s."listingId", s."inventoryLocationId", il."name" AS "locationName",
      p."name" AS "productName", v."name" AS "variantName", l."sellerSku",
      s."onHand"::text AS "onHand", s."reserved"::text AS "reserved",
      (s."onHand" - s."reserved")::text AS "available", s."reorderPoint"::text AS "reorderPoint"
    FROM "InventoryStock" s
    JOIN "InventoryLocation" il ON il."id" = s."inventoryLocationId"
    JOIN "SupplierListing" l ON l."id" = s."listingId"
    JOIN "CatalogVariant" v ON v."id" = l."variantId"
    JOIN "CatalogProduct" p ON p."id" = v."productId"
    WHERE l."supplierId" = ${supplierId} AND il."supplierId" = ${supplierId}
    ORDER BY il."name" ASC, p."name" ASC, v."name" ASC
  `);
  return rows.map((row) => ({
    ...row,
    onHand: Number(row.onHand),
    reserved: Number(row.reserved),
    available: Number(row.available),
    reorderPoint: row.reorderPoint === null ? null : Number(row.reorderPoint),
  }));
}
