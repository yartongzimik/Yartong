import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed demo data in production.");
}

const demoUsers = [
  { role: UserRole.CUSTOMER, email: "customer.demo@yartong.local", displayName: "Demo Customer" },
  { role: UserRole.SKILLED_PROVIDER, email: "provider.demo@yartong.local", displayName: "Demo Skilled Provider" },
  { role: UserRole.LABOURER, email: "labourer.demo@yartong.local", displayName: "Demo Labourer" },
  { role: UserRole.CONTRACTOR, email: "contractor.demo@yartong.local", displayName: "Demo Contractor" },
  { role: UserRole.MATERIAL_SUPPLIER, email: "supplier.demo@yartong.local", displayName: "Demo Material Supplier" },
  { role: UserRole.ADMIN, email: "admin.demo@yartong.local", displayName: "Demo Admin" },
];

async function main() {
  const senapati = await prisma.location.upsert({
    where: { slug: "senapati-manipur-india" },
    update: { isActive: true, isPrimary: true },
    create: { slug: "senapati-manipur-india", name: "Senapati", district: "Senapati", state: "Manipur", country: "India", pincode: "795106", latitude: 25.2677, longitude: 94.0227, isActive: true, isPrimary: true },
  });

  for (const demo of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: { displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: "UNVERIFIED", primaryLocationId: senapati.id, isDemo: true },
      create: { email: demo.email, displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: "UNVERIFIED", primaryLocationId: senapati.id, isDemo: true },
    });

    if (demo.role === UserRole.CUSTOMER) await prisma.customerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, bio: "Demo customer exploring Yartong." }, create: { userId: user.id, onboardingComplete: true, bio: "Demo customer exploring Yartong." } });
    if (demo.role === UserRole.SKILLED_PROVIDER) await prisma.skilledProviderProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Trade Services", headline: "Masonry and repair specialist", experienceYears: 6, skills: ["Masonry", "Plastering", "Repairs"], serviceRadiusKm: 25, availableForWork: true } });
    if (demo.role === UserRole.LABOURER) await prisma.labourerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true, headline: "Reliable construction labourer", experienceYears: 3, skills: ["Site support", "Loading", "Concrete mixing"], availableForWork: true } });
    if (demo.role === UserRole.CONTRACTOR) await prisma.contractorProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Contractor Works", headline: "Small residential project contractor", experienceYears: 8, teamSize: 5, projectTypes: ["Residential", "Renovation"], serviceRadiusKm: 40, availableForWork: true } });
    if (demo.role === UserRole.MATERIAL_SUPPLIER) await prisma.materialSupplierProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Building Materials", headline: "Cement, sand, steel and aggregates", materialCategories: ["Cement", "Sand", "Steel", "Aggregates"], deliveryAvailable: true, deliveryRadiusKm: 30, wholesaleAvailable: true } });
  }
}

main().finally(async () => prisma.$disconnect());
