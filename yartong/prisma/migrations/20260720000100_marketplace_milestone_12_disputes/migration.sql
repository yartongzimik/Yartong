-- Marketplace Milestone 12: disputes and resolution workflow

CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'AWAITING_RESPONSE', 'UNDER_REVIEW', 'RESOLVED', 'CANCELLED');
CREATE TYPE "DisputeCategory" AS ENUM ('WORK_QUALITY', 'INCOMPLETE_WORK', 'NO_SHOW', 'DELAY', 'SCOPE_DISAGREEMENT', 'PAYMENT', 'PROPERTY_DAMAGE', 'SAFETY', 'HARASSMENT', 'FRAUD', 'OTHER');
CREATE TYPE "DisputeResolution" AS ENUM ('NO_ACTION', 'MUTUAL_AGREEMENT', 'REDO_WORK', 'PARTIAL_REFUND_RECOMMENDED', 'FULL_REFUND_RECOMMENDED', 'PAYMENT_RELEASE_RECOMMENDED', 'ACCOUNT_ACTION', 'OTHER');
CREATE TYPE "DisputeEventKind" AS ENUM ('SYSTEM', 'STATEMENT', 'ADMIN_NOTE', 'STATUS_CHANGE', 'RESOLUTION');
CREATE TYPE "DisputeEventVisibility" AS ENUM ('PARTICIPANTS', 'ADMIN_ONLY');

CREATE TABLE "Dispute" (
  "id" TEXT NOT NULL,
  "engagementId" TEXT NOT NULL,
  "openedById" TEXT NOT NULL,
  "assignedAdminId" TEXT,
  "category" "DisputeCategory" NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "description" TEXT NOT NULL,
  "desiredOutcome" VARCHAR(2000),
  "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
  "previousEngagementStatus" "EngagementStatus" NOT NULL,
  "resolution" "DisputeResolution",
  "resolutionNote" VARCHAR(4000),
  "recommendedRefundAmount" INTEGER,
  "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewStartedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Dispute_refund_nonnegative" CHECK ("recommendedRefundAmount" IS NULL OR "recommendedRefundAmount" >= 0)
);

CREATE TABLE "DisputeEvent" (
  "id" TEXT NOT NULL,
  "disputeId" TEXT NOT NULL,
  "actorId" TEXT,
  "kind" "DisputeEventKind" NOT NULL,
  "visibility" "DisputeEventVisibility" NOT NULL DEFAULT 'PARTICIPANTS',
  "body" VARCHAR(4000) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DisputeEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Dispute_engagementId_key" ON "Dispute"("engagementId");
CREATE INDEX "Dispute_status_openedAt_idx" ON "Dispute"("status", "openedAt");
CREATE INDEX "Dispute_openedById_createdAt_idx" ON "Dispute"("openedById", "createdAt");
CREATE INDEX "Dispute_assignedAdminId_updatedAt_idx" ON "Dispute"("assignedAdminId", "updatedAt");
CREATE INDEX "DisputeEvent_disputeId_createdAt_idx" ON "DisputeEvent"("disputeId", "createdAt");
CREATE INDEX "DisputeEvent_actorId_createdAt_idx" ON "DisputeEvent"("actorId", "createdAt");

ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DisputeEvent" ADD CONSTRAINT "DisputeEvent_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DisputeEvent" ADD CONSTRAINT "DisputeEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
