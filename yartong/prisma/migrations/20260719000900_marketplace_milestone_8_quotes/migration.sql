CREATE TYPE "QuoteStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'SUPERSEDED');

CREATE TABLE "EngagementQuote" (
    "id" TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "scope" TEXT NOT NULL,
    "timelineDays" INTEGER,
    "note" VARCHAR(2000),
    "status" "QuoteStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EngagementQuote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EngagementQuote_engagementId_status_submittedAt_idx" ON "EngagementQuote"("engagementId", "status", "submittedAt");
CREATE INDEX "EngagementQuote_createdById_createdAt_idx" ON "EngagementQuote"("createdById", "createdAt");

ALTER TABLE "EngagementQuote" ADD CONSTRAINT "EngagementQuote_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EngagementQuote" ADD CONSTRAINT "EngagementQuote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EngagementQuote" ADD CONSTRAINT "EngagementQuote_amount_check" CHECK ("amount" > 0);
ALTER TABLE "EngagementQuote" ADD CONSTRAINT "EngagementQuote_timelineDays_check" CHECK ("timelineDays" IS NULL OR "timelineDays" > 0);
