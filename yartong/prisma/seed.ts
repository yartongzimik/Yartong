import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const roleUsers: Array<{
  role: UserRole;
  displayName: string;
  email: string;
}> = [
  { role: "CUSTOMER", displayName: "Demo Customer", email: "customer@example.test" },
  { role: "SKILLED_PROVIDER", displayName: "Demo Skilled Provider", email: "skilled-provider@example.test" },
  { role: "LABOURER", displayName: "Demo Labourer", email: "labourer@example.test" },
  { role: "CONTRACTOR", displayName: "Demo Contractor", email: "contractor@example.test" },
  { role: "MATERIAL_SUPPLIER", displayName: "Demo Material Supplier", email: "material-supplier@example.test" },
  { role: "ADMIN", displayName: "Demo Admin", email: "admin@example.test" },
];

async function createRoleProfile(userId: string, role: UserRole) {
  switch (role) {
    case "CUSTOMER":
      await prisma.customerProfile.upsert({ where: { userId }, update: {}, create: { userId, isVerifiedBuyer: true } });
      break;
    case "SKILLED_PROVIDER":
      await prisma.skilledProviderProfile.upsert({ where: { userId }, update: {}, create: { userId, businessName: "Demo Skilled Services", primaryTrade: "Masonry" } });
      break;
    case "LABOURER":
      await prisma.labourerProfile.upsert({ where: { userId }, update: {}, create: { userId, skills: ["Site assistance", "Material handling"] } });
      break;
    case "CONTRACTOR":
      await prisma.contractorProfile.upsert({ where: { userId }, update: {}, create: { userId, businessName: "Demo Contractor Works", teamSize: 8 } });
      break;
    case "MATERIAL_SUPPLIER":
      await prisma.materialSupplierProfile.upsert({ where: { userId }, update: {}, create: { userId, businessName: "Demo Materials Store", materialCategories: ["Cement", "Steel"] } });
      break;
    case "ADMIN":
      break;
  }
}

async function main() {
  const senapati = await prisma.location.upsert({
    where: { slug: "senapati" },
    update: { isPrimary: true, isActive: true },
    create: { slug: "senapati", name: "Senapati", district: "Senapati", state: "Manipur", country: "India", isPrimary: true, isActive: true },
  });

  for (const demoUser of roleUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { displayName: demoUser.displayName, primaryRole: demoUser.role, locationId: senapati.id, isDemo: true },
      create: { displayName: demoUser.displayName, name: demoUser.displayName, email: demoUser.email, primaryRole: demoUser.role, accountStatus: "ACTIVE", verificationStatus: demoUser.role === "ADMIN" ? "YARTONG_VERIFIED" : "UNVERIFIED", locationId: senapati.id, isDemo: true },
    });

    await createRoleProfile(user.id, demoUser.role);
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
