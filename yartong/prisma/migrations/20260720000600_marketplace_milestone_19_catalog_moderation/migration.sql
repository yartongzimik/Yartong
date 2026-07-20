-- Marketplace Milestone 19: catalog moderation and canonical-product audit trail

CREATE TABLE "CatalogModerationEvent" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "targetProductId" TEXT,
  "actorId" TEXT,
  "action" VARCHAR(40) NOT NULL,
  "note" VARCHAR(1000),
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogModerationEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CatalogModerationEvent_action_check" CHECK ("action" IN ('APPROVE', 'SEND_TO_REVIEW', 'ARCHIVE', 'RESTORE_TO_REVIEW', 'MERGE'))
);

CREATE INDEX "CatalogModerationEvent_productId_createdAt_idx" ON "CatalogModerationEvent"("productId", "createdAt");
CREATE INDEX "CatalogModerationEvent_targetProductId_createdAt_idx" ON "CatalogModerationEvent"("targetProductId", "createdAt");
CREATE INDEX "CatalogModerationEvent_actorId_createdAt_idx" ON "CatalogModerationEvent"("actorId", "createdAt");

ALTER TABLE "CatalogModerationEvent" ADD CONSTRAINT "CatalogModerationEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CatalogProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CatalogModerationEvent" ADD CONSTRAINT "CatalogModerationEvent_targetProductId_fkey" FOREIGN KEY ("targetProductId") REFERENCES "CatalogProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CatalogModerationEvent" ADD CONSTRAINT "CatalogModerationEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
