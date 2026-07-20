-- Apply defaults only after the ONBOARDING_PENDING enum value has been committed.
ALTER TABLE "User" ALTER COLUMN "displayName" SET DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "primaryRole" SET DEFAULT 'ONBOARDING_PENDING';
ALTER TABLE "User" ALTER COLUMN "accountStatus" SET DEFAULT 'ACTIVE';
