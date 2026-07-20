-- Add a safe, non-marketplace role for newly authenticated users who have not completed onboarding.
-- Keep the enum change isolated in its own migration transaction. PostgreSQL does not
-- allow a newly-added enum value to be used until the transaction that added it commits.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ONBOARDING_PENDING';
