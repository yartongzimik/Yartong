CREATE TYPE "EngagementStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');

CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerRole" "JobProviderRole" NOT NULL,
    "scope" TEXT NOT NULL,
    "agreedPrice" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "proposedTimelineDays" INTEGER,
    "status" "EngagementStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "disputedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Engagement_jobId_key" ON "Engagement"("jobId");
CREATE UNIQUE INDEX "Engagement_applicationId_key" ON "Engagement"("applicationId");
CREATE INDEX "Engagement_customerId_status_idx" ON "Engagement"("customerId", "status");
CREATE INDEX "Engagement_providerId_status_idx" ON "Engagement"("providerId", "status");
CREATE INDEX "Engagement_status_createdAt_idx" ON "Engagement"("status", "createdAt");

ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
