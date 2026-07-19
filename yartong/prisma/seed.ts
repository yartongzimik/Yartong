import { AccountStatus, UserRole, VerificationStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

if (process.env.NODE_ENV === "production") {
  throw new Error("Demo seed data is disabled in production.");
}

const demoUsers = [
  { email: "customer.demo@yartong.local", name: "Customer Demo", primaryRole: UserRole.CUSTOMER },
  { email: "skilled.demo@yartong.local", name: "Skilled Provider Demo", primaryRole: UserRole.SKILLED_PROVIDER },
  { email: "labourer.demo@yartong.local", name: "Labourer Demo", primaryRole: UserRole.LABOURER },
  { email: "contractor.demo@yartong.local", name: "Contractor Demo", primaryRole: UserRole.CONTRACTOR },
  { email: "supplier.demo@yartong.local", name: "Supplier Demo", primaryRole: UserRole.MATERIAL_SUPPLIER },
  { email: "admin.demo@yartong.local", name: "Admin Demo", primaryRole: UserRole.ADMIN },
];

async function main() {
  await prisma.location.upsert({
    where: { id: "seed-location-senapati" },
    update: {},
    create: {
      id: "seed-location-senapati",
      name: "Senapati",
      district: "Senapati",
      state: "Manipur",
      country: "India",
      isDemo: true,
    },
  });

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { name: demoUser.name, primaryRole: demoUser.primaryRole, accountStatus: AccountStatus.ACTIVE, isDemo: true },
      create: { ...demoUser, accountStatus: AccountStatus.ACTIVE, isDemo: true },
    });

    if (demoUser.primaryRole === UserRole.CUSTOMER) {
      await prisma.customerProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, verificationStatus: VerificationStatus.VERIFIED, isDemo: true } });
    }
    if (demoUser.primaryRole === UserRole.SKILLED_PROVIDER) {
      await prisma.skilledProviderProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, trade: "Masonry", experienceYears: 5, verificationStatus: VerificationStatus.VERIFIED, isDemo: true } });
    }
    if (demoUser.primaryRole === UserRole.LABOURER) {
      await prisma.labourerProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, skillLevel: "Experienced", verificationStatus: VerificationStatus.VERIFIED, isDemo: true } });
    }
    if (demoUser.primaryRole === UserRole.CONTRACTOR) {
      await prisma.contractorProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, companyName: "Senapati Build Demo", licenseNumber: "DEMO-CONTRACTOR", verificationStatus: VerificationStatus.VERIFIED, isDemo: true } });
    }
    if (demoUser.primaryRole === UserRole.MATERIAL_SUPPLIER) {
      await prisma.materialSupplierProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, businessName: "Senapati Materials Demo", verificationStatus: VerificationStatus.VERIFIED, isDemo: true } });
    }
  }
}

main().finally(async () => prisma.$disconnect());
