-- Add a safe, non-marketplace role for newly authenticated users who have not completed onboarding.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ONBOARDING_PENDING';

ALTER TABLE "User" ALTER COLUMN "displayName" SET DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "primaryRole" SET DEFAULT 'ONBOARDING_PENDING';
ALTER TABLE "User" ALTER COLUMN "accountStatus" SET DEFAULT 'ACTIVE';
