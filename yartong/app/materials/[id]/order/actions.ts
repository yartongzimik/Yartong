"use server";

import { randomUUID } from "node:crypto";
import { Prisma, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

function numberValue(formData: FormData, key: string) {
  const value = Number(String(formData.get(key) ?? ""));
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${key} must be greater than zero.`);
  return value;
}

export async function placeMaterialOrderAction(productId: string, formData: FormData): Promise<void> {
  const customer = await requireUser();
  if (customer.primaryRole !== UserRole.CUSTOMER) throw new Error("Only customer accounts can place material orders.");

  const listingId = String(formData.get("listingId") ?? "").trim();
  const stockId = String(formData.get("stockId") ?? "").trim();
  const quantity = numberValue(formData, "quantity");
  const fulfillmentMethod = String(formData.get("fulfillmentMethod") ?? "PICKUP");
  if (!['PICKUP', 'DELIVERY'].includes(fulfillmentMethod)) throw new Error("Select a valid fulfillment method.");
  const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
  const customerNote = String(formData.get("customerNote") ?? "").trim().slice(0, 2000) || null;
  if (fulfillmentMethod === "DELIVERY" && !deliveryAddress) throw new Error("Delivery address is required for delivery orders.");

  const orderId = randomUUID();
  const orderNumber = `YO-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 5).toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<Array<{
      listingId: string;
      supplierId: string;
      stockId: string;
      inventoryLocationId: string;
      onHand: string;
      reserved: string;
      price: number;
      currency: string;
      minOrderQty: string;
      deliveryAvailable: boolean;
      productName: string;
      variantName: string;
      sellerSku: string;
      unitName: string;
    }>>(Prisma.sql`
      SELECT l."id" AS "listingId", l."supplierId", s."id" AS "stockId", s."inventoryLocationId",
        s."onHand"::text AS "onHand", s."reserved"::text AS "reserved", l."price", l."currency",
        l."minOrderQty"::text AS "minOrderQty", l."deliveryAvailable",
        p."name" AS "productName", v."name" AS "variantName", l."sellerSku", v."unitName"
      FROM "SupplierListing" l
      JOIN "CatalogVariant" v ON v."id" = l."variantId"
      JOIN "CatalogProduct" p ON p."id" = v."productId"
      JOIN "InventoryStock" s ON s."listingId" = l."id"
      JOIN "InventoryLocation" il ON il."id" = s."inventoryLocationId"
      WHERE l."id" = ${listingId} AND s."id" = ${stockId}
        AND p."id" = ${productId}
        AND l."status" = 'ACTIVE'::"SupplierListingStatus"
        AND il."isActive" = true
      FOR UPDATE OF s
      LIMIT 1
    `);
    const item = rows[0];
    if (!item) throw new Error("The selected supplier stock is no longer available.");
    if (quantity < Number(item.minOrderQty)) throw new Error(`Minimum order quantity is ${item.minOrderQty}.`);
    if (fulfillmentMethod === "DELIVERY" && !item.deliveryAvailable) throw new Error("This listing does not offer delivery.");
    const available = Number(item.onHand) - Number(item.reserved);
    if (quantity > available) throw new Error("Requested quantity exceeds currently available stock.");

    const lineTotal = Math.round(item.price * quantity);
    await tx.$executeRaw(Prisma.sql`
      UPDATE "InventoryStock"
      SET "reserved" = "reserved" + ${quantity}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${item.stockId}
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "InventoryMovement" (
        "id", "stockId", "actorId", "type", "onHandDelta", "reservedDelta", "reason", "reference"
      ) VALUES (
        ${randomUUID()}, ${item.stockId}, ${customer.id}, 'RESERVE'::"InventoryMovementType", 0, ${quantity},
        'Reserved for placed material order', ${orderNumber}
      )
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrder" (
        "id", "orderNumber", "customerId", "supplierId", "inventoryLocationId", "status",
        "fulfillmentMethod", "deliveryAddress", "customerNote", "currency", "subtotal", "updatedAt"
      ) VALUES (
        ${orderId}, ${orderNumber}, ${customer.id}, ${item.supplierId}, ${item.inventoryLocationId},
        'PLACED'::"MaterialOrderStatus", ${fulfillmentMethod}::"MaterialFulfillmentMethod",
        ${fulfillmentMethod === "DELIVERY" ? deliveryAddress.slice(0, 700) : null}, ${customerNote},
        ${item.currency}, ${lineTotal}, CURRENT_TIMESTAMP
      )
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderItem" (
        "id", "orderId", "listingId", "stockId", "productNameSnapshot", "variantNameSnapshot",
        "sellerSkuSnapshot", "unitNameSnapshot", "quantity", "unitPrice", "lineTotal"
      ) VALUES (
        ${randomUUID()}, ${orderId}, ${item.listingId}, ${item.stockId}, ${item.productName}, ${item.variantName},
        ${item.sellerSku}, ${item.unitName}, ${quantity}, ${item.price}, ${lineTotal}
      )
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "MaterialOrderEvent" ("id", "orderId", "actorId", "type", "note")
      VALUES (${randomUUID()}, ${orderId}, ${customer.id}, 'PLACED'::"MaterialOrderEventType", 'Order placed and inventory reserved.')
    `);
  }, { isolationLevel: "Serializable" });

  redirect(`/customer/material-orders/${orderId}`);
}
