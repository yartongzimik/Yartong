import { JobBudgetType, JobProviderRole, JobStatus, JobUrgency, PrismaClient, UserRole } from "@prisma/client";

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

  const mao = await prisma.location.upsert({
    where: { slug: "mao-manipur-india" },
    update: { isActive: true, isPrimary: false },
    create: { slug: "mao-manipur-india", name: "Mao", district: "Senapati", state: "Manipur", country: "India", pincode: "795150", latitude: 25.5105, longitude: 94.1411, isActive: true, isPrimary: false },
  });

  const kangpokpi = await prisma.location.upsert({
    where: { slug: "kangpokpi-manipur-india" },
    update: { isActive: true, isPrimary: false },
    create: { slug: "kangpokpi-manipur-india", name: "Kangpokpi", district: "Kangpokpi", state: "Manipur", country: "India", pincode: "795129", latitude: 25.1514, longitude: 93.9706, isActive: true, isPrimary: false },
  });

  for (const demo of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: { displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: "UNVERIFIED", primaryLocationId: demo.role === UserRole.LABOURER ? mao.id : demo.role === UserRole.CONTRACTOR ? kangpokpi.id : senapati.id, isDemo: true },
      create: { email: demo.email, displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: "UNVERIFIED", primaryLocationId: demo.role === UserRole.LABOURER ? mao.id : demo.role === UserRole.CONTRACTOR ? kangpokpi.id : senapati.id, isDemo: true },
    });

    if (demo.role === UserRole.CUSTOMER) await prisma.customerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, bio: "Demo customer exploring Yartong." }, create: { userId: user.id, onboardingComplete: true, bio: "Demo customer exploring Yartong." } });
    if (demo.role === UserRole.SKILLED_PROVIDER) await prisma.skilledProviderProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName: "Demo Hillside Masonry", headline: "Masonry and repair specialist for homes and retaining walls", experienceYears: 6, skills: ["Masonry", "Plastering", "Stone work", "Repairs"], serviceRadiusKm: 25, availableForWork: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Hillside Masonry", headline: "Masonry and repair specialist for homes and retaining walls", experienceYears: 6, skills: ["Masonry", "Plastering", "Stone work", "Repairs"], serviceRadiusKm: 25, availableForWork: true } });
    if (demo.role === UserRole.LABOURER) await prisma.labourerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, headline: "Reliable construction labourer for site support", experienceYears: 3, skills: ["Site support", "Loading", "Concrete mixing", "Material shifting"], availableForWork: true }, create: { userId: user.id, onboardingComplete: true, headline: "Reliable construction labourer for site support", experienceYears: 3, skills: ["Site support", "Loading", "Concrete mixing", "Material shifting"], availableForWork: true } });
    if (demo.role === UserRole.CONTRACTOR) await prisma.contractorProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName: "Demo Valley Contractor Works", headline: "Residential renovation and small project contractor", experienceYears: 8, teamSize: 5, projectTypes: ["Residential", "Renovation", "Boundary wall"], serviceRadiusKm: 40, availableForWork: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Valley Contractor Works", headline: "Residential renovation and small project contractor", experienceYears: 8, teamSize: 5, projectTypes: ["Residential", "Renovation", "Boundary wall"], serviceRadiusKm: 40, availableForWork: true } });
    if (demo.role === UserRole.MATERIAL_SUPPLIER) await prisma.materialSupplierProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true, businessName: "Demo Building Materials", headline: "Cement, sand, steel and aggregates", materialCategories: ["Cement", "Sand", "Steel", "Aggregates"], deliveryAvailable: true, deliveryRadiusKm: 30, wholesaleAvailable: true } });
  }
  const customer = await prisma.user.findUniqueOrThrow({ where: { email: "customer.demo@yartong.local" } });
  const demoJobs = [
    { title: "Repair kitchen water seepage", description: "Need a skilled provider to inspect and repair water seepage near the kitchen wall before repainting.", category: "Home repair", skills: ["Masonry", "Repairs"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 250000, budgetMax: 600000, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Two labourers for material shifting", description: "Looking for reliable labourers to shift sand and bricks at a residential site for one day.", category: "Site labour", skills: ["Material shifting", "Loading"], targetProviderRoles: [JobProviderRole.LABOURER], locationId: mao.id, budgetType: JobBudgetType.FIXED, budgetMin: 180000, budgetMax: null, urgency: JobUrgency.WITHIN_24_HOURS, status: JobStatus.PUBLISHED },
    { title: "Boundary wall estimate and construction", description: "Need a contractor to assess and quote for a small boundary wall project.", category: "Construction", skills: ["Boundary wall", "Residential"], targetProviderRoles: [JobProviderRole.CONTRACTOR], locationId: kangpokpi.id, budgetType: JobBudgetType.NEGOTIABLE, budgetMin: null, budgetMax: null, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Draft bathroom renovation plan", description: "Private draft for a future bathroom renovation job.", category: "Renovation", skills: ["Plumbing", "Tiling"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER, JobProviderRole.CONTRACTOR], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 1500000, budgetMax: 3000000, urgency: JobUrgency.STANDARD, status: JobStatus.DRAFT },
    { title: "Closed roof inspection request", description: "Completed listing kept for private customer history only.", category: "Roofing", skills: ["Inspection"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.FIXED, budgetMin: 500000, budgetMax: null, urgency: JobUrgency.EMERGENCY, status: JobStatus.CLOSED },
  ];
  for (const job of demoJobs) {
    const now = new Date();
    await prisma.job.upsert({
      where: { id: `demo-${job.title.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}` },
      update: { ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
      create: { id: `demo-${job.title.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}`, ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
    });
  }

}

main().finally(async () => prisma.$disconnect());
