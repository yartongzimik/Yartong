-- Marketplace Milestone 13: global-scale catalog and inventory foundation

CREATE TYPE "CatalogProductStatus" AS ENUM ('ACTIVE', 'PENDING_REVIEW', 'MERGED', 'ARCHIVED');
CREATE TYPE "CatalogProductSource" AS ENUM ('ADMIN_CURATED', 'SUPPLIER_SUBMITTED', 'IMPORTED');
CREATE TYPE "CatalogVariantStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "SupplierListingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');
CREATE TYPE "InventoryMovementType" AS ENUM ('RESTOCK', 'SALE', 'RESERVE', 'RELEASE', 'RETURN', 'DAMAGE', 'ADJUSTMENT');

CREATE TABLE "CatalogCategory" (
  "id" TEXT NOT NULL,
  "parentId" TEXT,
  "slug" TEXT NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "description" VARCHAR(1000),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CatalogBrand" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "websiteUrl" VARCHAR(500),
  "countryCode" VARCHAR(2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogBrand_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CatalogProduct" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "brandId" TEXT,
  "createdBySupplierId" TEXT,
  "slug" TEXT NOT NULL,
  "name" VARCHAR(240) NOT NULL,
  "description" TEXT,
  "manufacturerPartNumber" VARCHAR(160),
  "attributes" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "status" "CatalogProductStatus" NOT NULL DEFAULT 'ACTIVE',
  "source" "CatalogProductSource" NOT NULL DEFAULT 'SUPPLIER_SUBMITTED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CatalogVariant" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "sku" VARCHAR(160) NOT NULL,
  "name" VARCHAR(240) NOT NULL,
  "gtin" VARCHAR(32),
  "unitName" VARCHAR(80) NOT NULL,
  "unitQuantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
  "attributes" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "status" "CatalogVariantStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogVariant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CatalogVariant_unitQuantity_positive" CHECK ("unitQuantity" > 0)
);

CREATE TABLE "SupplierListing" (
  "id" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "sellerSku" VARCHAR(160) NOT NULL,
  "title" VARCHAR(260),
  "description" VARCHAR(3000),
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "price" INTEGER NOT NULL,
  "minOrderQty" DECIMAL(18,3) NOT NULL DEFAULT 1,
  "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false,
  "leadTimeDays" INTEGER,
  "status" "SupplierListingStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupplierListing_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SupplierListing_price_nonnegative" CHECK ("price" >= 0),
  CONSTRAINT "SupplierListing_minOrderQty_positive" CHECK ("minOrderQty" > 0),
  CONSTRAINT "SupplierListing_leadTimeDays_nonnegative" CHECK ("leadTimeDays" IS NULL OR "leadTimeDays" >= 0)
);

CREATE TABLE "InventoryLocation" (
  "id" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "locationId" TEXT,
  "name" VARCHAR(160) NOT NULL,
  "addressLine" VARCHAR(500),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryStock" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "inventoryLocationId" TEXT NOT NULL,
  "onHand" DECIMAL(18,3) NOT NULL DEFAULT 0,
  "reserved" DECIMAL(18,3) NOT NULL DEFAULT 0,
  "reorderPoint" DECIMAL(18,3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryStock_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "InventoryStock_onHand_nonnegative" CHECK ("onHand" >= 0),
  CONSTRAINT "InventoryStock_reserved_nonnegative" CHECK ("reserved" >= 0),
  CONSTRAINT "InventoryStock_reserved_not_above_onHand" CHECK ("reserved" <= "onHand"),
  CONSTRAINT "InventoryStock_reorderPoint_nonnegative" CHECK ("reorderPoint" IS NULL OR "reorderPoint" >= 0)
);

CREATE TABLE "InventoryMovement" (
  "id" TEXT NOT NULL,
  "stockId" TEXT NOT NULL,
  "actorId" TEXT,
  "type" "InventoryMovementType" NOT NULL,
  "onHandDelta" DECIMAL(18,3) NOT NULL DEFAULT 0,
  "reservedDelta" DECIMAL(18,3) NOT NULL DEFAULT 0,
  "reason" VARCHAR(1000),
  "reference" VARCHAR(255),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CatalogCategory_slug_key" ON "CatalogCategory"("slug");
CREATE INDEX "CatalogCategory_parentId_sortOrder_idx" ON "CatalogCategory"("parentId", "sortOrder");
CREATE INDEX "CatalogCategory_isActive_name_idx" ON "CatalogCategory"("isActive", "name");

CREATE UNIQUE INDEX "CatalogBrand_slug_key" ON "CatalogBrand"("slug");
CREATE INDEX "CatalogBrand_name_idx" ON "CatalogBrand"("name");

CREATE UNIQUE INDEX "CatalogProduct_slug_key" ON "CatalogProduct"("slug");
CREATE INDEX "CatalogProduct_categoryId_status_name_idx" ON "CatalogProduct"("categoryId", "status", "name");
CREATE INDEX "CatalogProduct_brandId_status_idx" ON "CatalogProduct"("brandId", "status");
CREATE INDEX "CatalogProduct_createdBySupplierId_createdAt_idx" ON "CatalogProduct"("createdBySupplierId", "createdAt");

CREATE UNIQUE INDEX "CatalogVariant_sku_key" ON "CatalogVariant"("sku");
CREATE UNIQUE INDEX "CatalogVariant_gtin_key" ON "CatalogVariant"("gtin") WHERE "gtin" IS NOT NULL;
CREATE INDEX "CatalogVariant_productId_status_idx" ON "CatalogVariant"("productId", "status");

CREATE UNIQUE INDEX "SupplierListing_supplierId_sellerSku_key" ON "SupplierListing"("supplierId", "sellerSku");
CREATE UNIQUE INDEX "SupplierListing_supplierId_variantId_key" ON "SupplierListing"("supplierId", "variantId");
CREATE INDEX "SupplierListing_variantId_status_price_idx" ON "SupplierListing"("variantId", "status", "price");
CREATE INDEX "SupplierListing_supplierId_status_updatedAt_idx" ON "SupplierListing"("supplierId", "status", "updatedAt");

CREATE UNIQUE INDEX "InventoryLocation_supplierId_name_key" ON "InventoryLocation"("supplierId", "name");
CREATE INDEX "InventoryLocation_supplierId_isActive_idx" ON "InventoryLocation"("supplierId", "isActive");

CREATE UNIQUE INDEX "InventoryStock_listingId_inventoryLocationId_key" ON "InventoryStock"("listingId", "inventoryLocationId");
CREATE INDEX "InventoryStock_inventoryLocationId_updatedAt_idx" ON "InventoryStock"("inventoryLocationId", "updatedAt");
CREATE INDEX "InventoryMovement_stockId_createdAt_idx" ON "InventoryMovement"("stockId", "createdAt");
CREATE INDEX "InventoryMovement_actorId_createdAt_idx" ON "InventoryMovement"("actorId", "createdAt");

ALTER TABLE "CatalogCategory" ADD CONSTRAINT "CatalogCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CatalogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CatalogProduct" ADD CONSTRAINT "CatalogProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CatalogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CatalogProduct" ADD CONSTRAINT "CatalogProduct_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "CatalogBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CatalogProduct" ADD CONSTRAINT "CatalogProduct_createdBySupplierId_fkey" FOREIGN KEY ("createdBySupplierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CatalogVariant" ADD CONSTRAINT "CatalogVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CatalogProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SupplierListing" ADD CONSTRAINT "SupplierListing_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SupplierListing" ADD CONSTRAINT "SupplierListing_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "CatalogVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InventoryLocation" ADD CONSTRAINT "InventoryLocation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InventoryLocation" ADD CONSTRAINT "InventoryLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InventoryStock" ADD CONSTRAINT "InventoryStock_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "SupplierListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryStock" ADD CONSTRAINT "InventoryStock_inventoryLocationId_fkey" FOREIGN KEY ("inventoryLocationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "InventoryStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed only high-level taxonomy roots. These are categories, not fabricated products or stock.
INSERT INTO "CatalogCategory" ("id", "slug", "name", "description", "sortOrder") VALUES
  ('cat-building-materials', 'building-materials', 'Building Materials', 'Cement, aggregates, masonry, timber, roofing, boards and structural materials.', 10),
  ('cat-tools-hardware', 'tools-hardware', 'Tools & Hardware', 'Hand tools, power tools, fasteners, fixings and workshop hardware.', 20),
  ('cat-electrical', 'electrical', 'Electrical', 'Electrical installation materials, cables, protection, lighting and accessories.', 30),
  ('cat-plumbing', 'plumbing', 'Plumbing', 'Pipes, fittings, valves, sanitary systems, pumps and water-management products.', 40),
  ('cat-paints-finishes', 'paints-finishes', 'Paints & Finishes', 'Paints, coatings, adhesives, sealants, tiles and finishing materials.', 50),
  ('cat-safety-ppe', 'safety-ppe', 'Safety & PPE', 'Personal protective equipment, site safety and workplace protection.', 60),
  ('cat-industrial-supplies', 'industrial-supplies', 'Industrial Supplies', 'Industrial consumables, machinery accessories and maintenance supplies.', 70),
  ('cat-home-improvement', 'home-improvement', 'Home Improvement', 'Fixtures, fittings, storage and general improvement products.', 80)
ON CONFLICT ("slug") DO NOTHING;
