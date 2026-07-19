-- Backend Milestone 1 account and role profile foundation.
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'SKILLED_PROVIDER', 'LABOURER', 'CONTRACTOR', 'MATERIAL_SUPPLIER', 'ADMIN');
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'DEACTIVATED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "primaryRole" "UserRole" NOT NULL,
  "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "CustomerProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SkilledProviderProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "SkilledProviderProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "SkilledProviderProfile_userId_key" ON "SkilledProviderProfile"("userId");
ALTER TABLE "SkilledProviderProfile" ADD CONSTRAINT "SkilledProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "LabourerProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "LabourerProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "LabourerProfile_userId_key" ON "LabourerProfile"("userId");
ALTER TABLE "LabourerProfile" ADD CONSTRAINT "LabourerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ContractorProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "ContractorProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "ContractorProfile_userId_key" ON "ContractorProfile"("userId");
ALTER TABLE "ContractorProfile" ADD CONSTRAINT "ContractorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "MaterialSupplierProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "MaterialSupplierProfile_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "MaterialSupplierProfile_userId_key" ON "MaterialSupplierProfile"("userId");
ALTER TABLE "MaterialSupplierProfile" ADD CONSTRAINT "MaterialSupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
