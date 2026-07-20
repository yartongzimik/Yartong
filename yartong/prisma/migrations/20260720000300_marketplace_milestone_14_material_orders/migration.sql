-- Marketplace Milestone 14: material orders and inventory reservation

CREATE TYPE "MaterialOrderStatus" AS ENUM ('PLACED', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'FULFILLED', 'CANCELLED');
CREATE TYPE "MaterialFulfillmentMethod" AS ENUM ('PICKUP', 'DELIVERY');
CREATE TYPE "MaterialOrderEventType" AS ENUM ('PLACED', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'FULFILLED', 'CANCELLED', 'NOTE');

CREATE TABLE "MaterialOrder" (
  "id" TEXT NOT NULL,
  "orderNumber" VARCHAR(32) NOT NULL,
  "customerId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "inventoryLocationId" TEXT NOT NULL,
  "status" "MaterialOrderStatus" NOT NULL DEFAULT 'PLACED',
  "fulfillmentMethod" "MaterialFulfillmentMethod" NOT NULL,
  "deliveryAddress" VARCHAR(700),
  "customerNote" VARCHAR(2000),
  "supplierNote" VARCHAR(2000),
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "subtotal" INTEGER NOT NULL,
  "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP(3),
  "readyAt" TIMESTAMP(3),
  "fulfilledAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaterialOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MaterialOrder_subtotal_nonnegative" CHECK ("subtotal" >= 0)
);

CREATE TABLE "MaterialOrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "stockId" TEXT NOT NULL,
  "productNameSnapshot" VARCHAR(240) NOT NULL,
  "variantNameSnapshot" VARCHAR(240) NOT NULL,
  "sellerSkuSnapshot" VARCHAR(160) NOT NULL,
  "unitNameSnapshot" VARCHAR(80) NOT NULL,
  "quantity" DECIMAL(18,3) NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "lineTotal" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaterialOrderItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MaterialOrderItem_quantity_positive" CHECK ("quantity" > 0),
  CONSTRAINT "MaterialOrderItem_unitPrice_nonnegative" CHECK ("unitPrice" >= 0),
  CONSTRAINT "MaterialOrderItem_lineTotal_nonnegative" CHECK ("lineTotal" >= 0)
);

CREATE TABLE "MaterialOrderEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "actorId" TEXT,
  "type" "MaterialOrderEventType" NOT NULL,
  "note" VARCHAR(2000),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaterialOrderEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MaterialOrder_orderNumber_key" ON "MaterialOrder"("orderNumber");
CREATE INDEX "MaterialOrder_customerId_status_createdAt_idx" ON "MaterialOrder"("customerId", "status", "createdAt");
CREATE INDEX "MaterialOrder_supplierId_status_createdAt_idx" ON "MaterialOrder"("supplierId", "status", "createdAt");
CREATE INDEX "MaterialOrder_inventoryLocationId_status_idx" ON "MaterialOrder"("inventoryLocationId", "status");
CREATE INDEX "MaterialOrderItem_orderId_idx" ON "MaterialOrderItem"("orderId");
CREATE INDEX "MaterialOrderItem_listingId_createdAt_idx" ON "MaterialOrderItem"("listingId", "createdAt");
CREATE INDEX "MaterialOrderEvent_orderId_createdAt_idx" ON "MaterialOrderEvent"("orderId", "createdAt");

ALTER TABLE "MaterialOrder" ADD CONSTRAINT "MaterialOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaterialOrder" ADD CONSTRAINT "MaterialOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaterialOrder" ADD CONSTRAINT "MaterialOrder_inventoryLocationId_fkey" FOREIGN KEY ("inventoryLocationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaterialOrderItem" ADD CONSTRAINT "MaterialOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "MaterialOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaterialOrderItem" ADD CONSTRAINT "MaterialOrderItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "SupplierListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaterialOrderItem" ADD CONSTRAINT "MaterialOrderItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "InventoryStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaterialOrderEvent" ADD CONSTRAINT "MaterialOrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "MaterialOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaterialOrderEvent" ADD CONSTRAINT "MaterialOrderEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
