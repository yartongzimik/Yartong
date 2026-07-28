import { JobBudgetType, JobProviderRole, JobStatus, JobUrgency, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed demo data in production.");
}

const demoUsers = [
  { role: UserRole.CUSTOMER, email: "customer.demo@yartong.local", displayName: "Demo Customer" },
  { role: UserRole.CUSTOMER, email: "customer2.demo@yartong.local", displayName: "Demo Homeowner" },
  { role: UserRole.SKILLED_PROVIDER, email: "provider.demo@yartong.local", displayName: "Demo Mason" },
  { role: UserRole.SKILLED_PROVIDER, email: "electrician.demo@yartong.local", displayName: "Demo Electrician" },
  { role: UserRole.SKILLED_PROVIDER, email: "plumber.demo@yartong.local", displayName: "Demo Plumber" },
  { role: UserRole.LABOURER, email: "labourer.demo@yartong.local", displayName: "Demo Labourer" },
  { role: UserRole.LABOURER, email: "labourer2.demo@yartong.local", displayName: "Demo Site Helper" },
  { role: UserRole.CONTRACTOR, email: "contractor.demo@yartong.local", displayName: "Demo Valley Contractor" },
  { role: UserRole.CONTRACTOR, email: "contractor2.demo@yartong.local", displayName: "Demo Hills Contractor" },
  { role: UserRole.MATERIAL_SUPPLIER, email: "supplier.demo@yartong.local", displayName: "Demo Building Materials" },
  { role: UserRole.MATERIAL_SUPPLIER, email: "supplier2.demo@yartong.local", displayName: "Demo Hardware Depot" },
  { role: UserRole.ADMIN, email: "admin.demo@yartong.local", displayName: "Demo Admin" },
];

type DemoJobSeed = {
  title: string;
  description: string;
  category: string;
  skills: string[];
  targetProviderRoles: JobProviderRole[];
  locationId: string;
  budgetType: JobBudgetType;
  budgetMin: number | null;
  budgetMax: number | null;
  urgency: JobUrgency;
  status: JobStatus;
};

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

  for (const [index, demo] of demoUsers.entries()) {
    const primaryLocationId = demo.role === UserRole.LABOURER ? mao.id : demo.role === UserRole.CONTRACTOR ? kangpokpi.id : senapati.id;
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: { displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: index % 3 === 0 ? "IDENTITY_VERIFIED" : "UNVERIFIED", primaryLocationId, isDemo: true },
      create: { email: demo.email, displayName: demo.displayName, name: demo.displayName, primaryRole: demo.role, accountStatus: "ACTIVE", verificationStatus: index % 3 === 0 ? "IDENTITY_VERIFIED" : "UNVERIFIED", primaryLocationId, isDemo: true },
    });

    if (demo.role === UserRole.CUSTOMER) {
      await prisma.customerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, bio: "QA customer testing local construction and repair workflows." }, create: { userId: user.id, onboardingComplete: true, bio: "QA customer testing local construction and repair workflows." } });
    }
    if (demo.role === UserRole.SKILLED_PROVIDER) {
      const skillSets = demo.email.includes("electrician") ? ["Electrical wiring", "Lighting", "Fault finding"] : demo.email.includes("plumber") ? ["Plumbing", "Pipe repair", "Water systems"] : ["Masonry", "Plastering", "Stone work", "Repairs"];
      await prisma.skilledProviderProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName: demo.displayName, headline: `${skillSets[0]} specialist serving local homes and sites`, experienceYears: 4 + (index % 6), skills: skillSets, serviceRadiusKm: 20 + index, availableForWork: true }, create: { userId: user.id, onboardingComplete: true, businessName: demo.displayName, headline: `${skillSets[0]} specialist serving local homes and sites`, experienceYears: 4 + (index % 6), skills: skillSets, serviceRadiusKm: 20 + index, availableForWork: true } });
    }
    if (demo.role === UserRole.LABOURER) {
      await prisma.labourerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, headline: "Reliable construction labourer for site support", experienceYears: 2 + (index % 4), skills: ["Site support", "Loading", "Concrete mixing", "Material shifting"], availableForWork: true }, create: { userId: user.id, onboardingComplete: true, headline: "Reliable construction labourer for site support", experienceYears: 2 + (index % 4), skills: ["Site support", "Loading", "Concrete mixing", "Material shifting"], availableForWork: true } });
    }
    if (demo.role === UserRole.CONTRACTOR) {
      await prisma.contractorProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName: demo.displayName, headline: "Residential construction and renovation contractor", experienceYears: 7 + (index % 5), teamSize: 4 + (index % 5), projectTypes: ["Residential", "Renovation", "Boundary wall"], serviceRadiusKm: 35 + index, availableForWork: true }, create: { userId: user.id, onboardingComplete: true, businessName: demo.displayName, headline: "Residential construction and renovation contractor", experienceYears: 7 + (index % 5), teamSize: 4 + (index % 5), projectTypes: ["Residential", "Renovation", "Boundary wall"], serviceRadiusKm: 35 + index, availableForWork: true } });
    }
    if (demo.role === UserRole.MATERIAL_SUPPLIER) {
      await prisma.materialSupplierProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName: demo.displayName, headline: "Construction materials, hardware and site supplies", materialCategories: ["Cement", "Sand", "Steel", "Hardware"], deliveryAvailable: true, deliveryRadiusKm: 30, wholesaleAvailable: true }, create: { userId: user.id, onboardingComplete: true, businessName: demo.displayName, headline: "Construction materials, hardware and site supplies", materialCategories: ["Cement", "Sand", "Steel", "Hardware"], deliveryAvailable: true, deliveryRadiusKm: 30, wholesaleAvailable: true } });
    }
  }

  const customer = await prisma.user.findUniqueOrThrow({ where: { email: "customer.demo@yartong.local" } });
  const demoJobs: DemoJobSeed[] = [
    { title: "Repair kitchen water seepage", description: "Inspect and repair water seepage near the kitchen wall before repainting.", category: "Home repair", skills: ["Masonry", "Repairs"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 250000, budgetMax: 600000, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Two labourers for material shifting", description: "Shift sand and bricks at a residential site for one day.", category: "Site labour", skills: ["Material shifting", "Loading"], targetProviderRoles: [JobProviderRole.LABOURER], locationId: mao.id, budgetType: JobBudgetType.FIXED, budgetMin: 180000, budgetMax: null, urgency: JobUrgency.WITHIN_24_HOURS, status: JobStatus.PUBLISHED },
    { title: "Boundary wall estimate and construction", description: "Assess and quote for a small residential boundary wall project.", category: "Construction", skills: ["Boundary wall", "Residential"], targetProviderRoles: [JobProviderRole.CONTRACTOR], locationId: kangpokpi.id, budgetType: JobBudgetType.NEGOTIABLE, budgetMin: null, budgetMax: null, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Replace damaged electrical switches", description: "Replace damaged switches and inspect a frequently tripping circuit.", category: "Electrical", skills: ["Electrical wiring", "Fault finding"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 120000, budgetMax: 350000, urgency: JobUrgency.WITHIN_24_HOURS, status: JobStatus.PUBLISHED },
    { title: "Repair leaking bathroom pipe", description: "Find and repair a concealed bathroom pipe leak with minimal wall damage.", category: "Plumbing", skills: ["Plumbing", "Pipe repair"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 200000, budgetMax: 500000, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Small shop renovation", description: "Renovate a small retail shop including partition, paint and basic finishing.", category: "Renovation", skills: ["Renovation", "Finishing"], targetProviderRoles: [JobProviderRole.CONTRACTOR], locationId: kangpokpi.id, budgetType: JobBudgetType.RANGE, budgetMin: 2500000, budgetMax: 5000000, urgency: JobUrgency.STANDARD, status: JobStatus.PUBLISHED },
    { title: "Three helpers for concrete pour", description: "Need three site helpers for one scheduled concrete pour.", category: "Site labour", skills: ["Concrete mixing", "Site support"], targetProviderRoles: [JobProviderRole.LABOURER], locationId: mao.id, budgetType: JobBudgetType.FIXED, budgetMin: 270000, budgetMax: null, urgency: JobUrgency.WITHIN_24_HOURS, status: JobStatus.PUBLISHED },
    { title: "Draft bathroom renovation plan", description: "Private draft for a future bathroom renovation job.", category: "Renovation", skills: ["Plumbing", "Tiling"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER, JobProviderRole.CONTRACTOR], locationId: senapati.id, budgetType: JobBudgetType.RANGE, budgetMin: 1500000, budgetMax: 3000000, urgency: JobUrgency.STANDARD, status: JobStatus.DRAFT },
    { title: "Draft retaining wall repair", description: "Planning-stage retaining wall repair awaiting measurements.", category: "Masonry", skills: ["Stone work", "Masonry"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER, JobProviderRole.CONTRACTOR], locationId: senapati.id, budgetType: JobBudgetType.NEGOTIABLE, budgetMin: null, budgetMax: null, urgency: JobUrgency.STANDARD, status: JobStatus.DRAFT },
    { title: "Closed roof inspection request", description: "Closed listing kept for QA history and status testing.", category: "Roofing", skills: ["Inspection"], targetProviderRoles: [JobProviderRole.SKILLED_PROVIDER], locationId: senapati.id, budgetType: JobBudgetType.FIXED, budgetMin: 500000, budgetMax: null, urgency: JobUrgency.EMERGENCY, status: JobStatus.CLOSED },
  ];

  for (const job of demoJobs) {
    const now = new Date();
    const id = `demo-${job.title.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}`;
    await prisma.job.upsert({
      where: { id },
      update: { ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
      create: { id, ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
    });
  }
}

main().finally(async () => prisma.$disconnect());
