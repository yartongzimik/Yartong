import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type OrderableStock = {
  stockId: string;
  listingId: string;
  supplierId: string;
  supplierName: string;
  supplierBusinessName: string | null;
  locationName: string;
  productName: string;
  variantName: string;
  sellerSku: string;
  unitName: string;
  minOrderQty: string;
  price: number;
  currency: string;
  deliveryAvailable: boolean;
  availableQty: number;
};

export type MaterialOrderSummary = {
  id: string;
  orderNumber: string;
  customerId: string;
  supplierId: string;
  customerName: string;
  supplierName: string;
  status: "PLACED" | "ACCEPTED" | "REJECTED" | "PREPARING" | "READY" | "FULFILLED" | "CANCELLED";
  fulfillmentMethod: "PICKUP" | "DELIVERY";
  deliveryAddress: string | null;
  customerNote: string | null;
  supplierNote: string | null;
  currency: string;
  subtotal: number;
  locationName: string;
  placedAt: Date;
  updatedAt: Date;
  productName: string;
  variantName: string;
  sellerSku: string;
  unitName: string;
  quantity: number;
  unitPrice: number;
};

export async function getOrderableStocks(productId: string) {
  const rows = await prisma.$queryRaw<Array<Omit<OrderableStock, "availableQty"> & { availableQty: string }>>(Prisma.sql`
    SELECT s."id" AS "stockId", l."id" AS "listingId", l."supplierId",
      supplier."displayName" AS "supplierName", sp."businessName" AS "supplierBusinessName",
      il."name" AS "locationName", p."name" AS "productName", v."name" AS "variantName",
      l."sellerSku", v."unitName", l."minOrderQty"::text AS "minOrderQty", l."price", l."currency",
      l."deliveryAvailable", (s."onHand" - s."reserved")::text AS "availableQty"
    FROM "InventoryStock" s
    JOIN "SupplierListing" l ON l."id" = s."listingId"
    JOIN "InventoryLocation" il ON il."id" = s."inventoryLocationId"
    JOIN "CatalogVariant" v ON v."id" = l."variantId"
    JOIN "CatalogProduct" p ON p."id" = v."productId"
    JOIN "User" supplier ON supplier."id" = l."supplierId"
    LEFT JOIN "MaterialSupplierProfile" sp ON sp."userId" = supplier."id"
    WHERE p."id" = ${productId}
      AND p."status" = 'ACTIVE'::"CatalogProductStatus"
      AND v."status" = 'ACTIVE'::"CatalogVariantStatus"
      AND l."status" = 'ACTIVE'::"SupplierListingStatus"
      AND il."isActive" = true
      AND (s."onHand" - s."reserved") > 0
    ORDER BY l."price" ASC, il."name" ASC
  `);
  return rows.map((row) => ({ ...row, availableQty: Number(row.availableQty) }));
}

export async function getMaterialOrderForUser(orderId: string, userId: string) {
  const rows = await prisma.$queryRaw<Array<Omit<MaterialOrderSummary, "quantity"> & { quantity: string }>>(Prisma.sql`
    SELECT o."id", o."orderNumber", o."customerId", o."supplierId",
      customer."displayName" AS "customerName", supplier."displayName" AS "supplierName",
      o."status"::text AS "status", o."fulfillmentMethod"::text AS "fulfillmentMethod",
      o."deliveryAddress", o."customerNote", o."supplierNote", o."currency", o."subtotal",
      il."name" AS "locationName", o."placedAt", o."updatedAt",
      i."productNameSnapshot" AS "productName", i."variantNameSnapshot" AS "variantName",
      i."sellerSkuSnapshot" AS "sellerSku", i."unitNameSnapshot" AS "unitName",
      i."quantity"::text AS "quantity", i."unitPrice"
    FROM "MaterialOrder" o
    JOIN "User" customer ON customer."id" = o."customerId"
    JOIN "User" supplier ON supplier."id" = o."supplierId"
    JOIN "InventoryLocation" il ON il."id" = o."inventoryLocationId"
    JOIN "MaterialOrderItem" i ON i."orderId" = o."id"
    WHERE o."id" = ${orderId} AND (o."customerId" = ${userId} OR o."supplierId" = ${userId})
    LIMIT 1
  `);
  return rows[0] ? { ...rows[0], quantity: Number(rows[0].quantity) } : null;
}

export async function listMaterialOrdersForUser(userId: string, asSupplier = false) {
  const ownerFilter = asSupplier ? Prisma.sql`o."supplierId" = ${userId}` : Prisma.sql`o."customerId" = ${userId}`;
  const rows = await prisma.$queryRaw<Array<Omit<MaterialOrderSummary, "quantity"> & { quantity: string }>>(Prisma.sql`
    SELECT o."id", o."orderNumber", o."customerId", o."supplierId",
      customer."displayName" AS "customerName", supplier."displayName" AS "supplierName",
      o."status"::text AS "status", o."fulfillmentMethod"::text AS "fulfillmentMethod",
      o."deliveryAddress", o."customerNote", o."supplierNote", o."currency", o."subtotal",
      il."name" AS "locationName", o."placedAt", o."updatedAt",
      i."productNameSnapshot" AS "productName", i."variantNameSnapshot" AS "variantName",
      i."sellerSkuSnapshot" AS "sellerSku", i."unitNameSnapshot" AS "unitName",
      i."quantity"::text AS "quantity", i."unitPrice"
    FROM "MaterialOrder" o
    JOIN "User" customer ON customer."id" = o."customerId"
    JOIN "User" supplier ON supplier."id" = o."supplierId"
    JOIN "InventoryLocation" il ON il."id" = o."inventoryLocationId"
    JOIN "MaterialOrderItem" i ON i."orderId" = o."id"
    WHERE ${ownerFilter}
    ORDER BY o."updatedAt" DESC
    LIMIT 200
  `);
  return rows.map((row) => ({ ...row, quantity: Number(row.quantity) }));
}
