CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'SKILLED_PROVIDER', 'LABOURER', 'CONTRACTOR', 'MATERIAL_SUPPLIER', 'ADMIN');
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'DEACTIVATED');
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PHONE_VERIFIED', 'IDENTITY_VERIFIED', 'BUSINESS_VERIFIED', 'YARTONG_VERIFIED');

CREATE TABLE "Location" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'India',
  "pincode" TEXT,
  "latitude" DECIMAL(9,6),
  "longitude" DECIMAL(9,6),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMP(3),
  "phoneNumber" TEXT,
  "image" TEXT,
  "primaryRole" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
  "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING',
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "primaryLocationId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastActiveAt" TIMESTAMP(3),
  "isDemo" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "CustomerProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "bio" VARCHAR(500), "preferredLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[], "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SkilledProviderProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "businessName" TEXT, "headline" TEXT, "bio" VARCHAR(800), "experienceYears" INTEGER, "skills" TEXT[] DEFAULT ARRAY[]::TEXT[], "serviceRadiusKm" INTEGER, "availableForWork" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "SkilledProviderProfile_pkey" PRIMARY KEY ("id"));
CREATE TABLE "LabourerProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "headline" TEXT, "bio" VARCHAR(500), "experienceYears" INTEGER, "skills" TEXT[] DEFAULT ARRAY[]::TEXT[], "availableForWork" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "LabourerProfile_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ContractorProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "businessName" TEXT, "headline" TEXT, "bio" VARCHAR(800), "experienceYears" INTEGER, "teamSize" INTEGER, "projectTypes" TEXT[] DEFAULT ARRAY[]::TEXT[], "serviceRadiusKm" INTEGER, "availableForWork" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ContractorProfile_pkey" PRIMARY KEY ("id"));
CREATE TABLE "MaterialSupplierProfile" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "businessName" TEXT, "headline" TEXT, "bio" VARCHAR(800), "materialCategories" TEXT[] DEFAULT ARRAY[]::TEXT[], "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false, "deliveryRadiusKm" INTEGER, "wholesaleAvailable" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "MaterialSupplierProfile_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");
CREATE UNIQUE INDEX "SkilledProviderProfile_userId_key" ON "SkilledProviderProfile"("userId");
CREATE UNIQUE INDEX "LabourerProfile_userId_key" ON "LabourerProfile"("userId");
CREATE UNIQUE INDEX "ContractorProfile_userId_key" ON "ContractorProfile"("userId");
CREATE UNIQUE INDEX "MaterialSupplierProfile_userId_key" ON "MaterialSupplierProfile"("userId");
CREATE INDEX "Location_district_state_country_idx" ON "Location"("district", "state", "country");
CREATE INDEX "Location_isActive_idx" ON "Location"("isActive");
CREATE INDEX "User_primaryRole_idx" ON "User"("primaryRole");
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");
CREATE INDEX "User_primaryLocationId_idx" ON "User"("primaryLocationId");

ALTER TABLE "User" ADD CONSTRAINT "User_primaryLocationId_fkey" FOREIGN KEY ("primaryLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SkilledProviderProfile" ADD CONSTRAINT "SkilledProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LabourerProfile" ADD CONSTRAINT "LabourerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContractorProfile" ADD CONSTRAINT "ContractorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaterialSupplierProfile" ADD CONSTRAINT "MaterialSupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
