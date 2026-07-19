CREATE TYPE "VerificationRequestType" AS ENUM ('IDENTITY', 'BUSINESS', 'PROFESSIONAL_CREDENTIAL');
CREATE TYPE "VerificationRequestStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "VerificationRequestType" NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "applicantNote" VARCHAR(2000),
    "reviewerId" TEXT,
    "reviewerNote" VARCHAR(2000),
    "providerName" VARCHAR(120),
    "providerRef" VARCHAR(255),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VerificationRequest_userId_status_createdAt_idx" ON "VerificationRequest"("userId", "status", "createdAt");
CREATE INDEX "VerificationRequest_status_type_submittedAt_idx" ON "VerificationRequest"("status", "type", "submittedAt");
CREATE INDEX "VerificationRequest_reviewerId_reviewedAt_idx" ON "VerificationRequest"("reviewerId", "reviewedAt");

ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
