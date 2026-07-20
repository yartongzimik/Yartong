CREATE TABLE "MutationRateLimit" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MutationRateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "MutationRateLimit_resetAt_idx" ON "MutationRateLimit"("resetAt");
