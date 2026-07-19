CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED');
CREATE TYPE "JobUrgency" AS ENUM ('STANDARD', 'WITHIN_24_HOURS', 'EMERGENCY');
CREATE TYPE "JobBudgetType" AS ENUM ('FIXED', 'RANGE', 'NEGOTIABLE');
CREATE TYPE "JobProviderRole" AS ENUM ('SKILLED_PROVIDER', 'LABOURER', 'CONTRACTOR');

CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetProviderRoles" "JobProviderRole"[] DEFAULT ARRAY[]::"JobProviderRole"[],
    "budgetType" "JobBudgetType" NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "urgency" "JobUrgency" NOT NULL DEFAULT 'STANDARD',
    "preferredStartDate" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Job_customerId_idx" ON "Job"("customerId");
CREATE INDEX "Job_locationId_idx" ON "Job"("locationId");
CREATE INDEX "Job_status_idx" ON "Job"("status");
CREATE INDEX "Job_publishedAt_idx" ON "Job"("publishedAt");
CREATE INDEX "Job_status_publishedAt_idx" ON "Job"("status", "publishedAt");

ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Job" ADD CONSTRAINT "Job_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
