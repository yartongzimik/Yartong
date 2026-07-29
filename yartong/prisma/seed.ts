import {
  ApplicationStatus,
  CatalogProductSource,
  CatalogProductStatus,
  CatalogVariantStatus,
  EngagementStatus,
  InventoryMovementType,
  JobBudgetType,
  JobProviderRole,
  JobStatus,
  JobUrgency,
  NotificationType,
  PrismaClient,
  ReviewStatus,
  SupplierListingStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

const allowQaPreviewSeed =
  process.env.ALLOW_QA_SEED === "true" && process.env.VERCEL_ENV === "preview";

if (process.env.NODE_ENV === "production" && !allowQaPreviewSeed) {
  throw new Error("Refusing to seed demo data outside an explicitly allowed QA preview build.");
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

function jobId(title: string) {
  return `demo-${title.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}`;
}

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
  const provider = await prisma.user.findUniqueOrThrow({ where: { email: "provider.demo@yartong.local" } });
  const electrician = await prisma.user.findUniqueOrThrow({ where: { email: "electrician.demo@yartong.local" } });
  const plumber = await prisma.user.findUniqueOrThrow({ where: { email: "plumber.demo@yartong.local" } });
  const labourer = await prisma.user.findUniqueOrThrow({ where: { email: "labourer.demo@yartong.local" } });
  const labourer2 = await prisma.user.findUniqueOrThrow({ where: { email: "labourer2.demo@yartong.local" } });
  const contractor = await prisma.user.findUniqueOrThrow({ where: { email: "contractor.demo@yartong.local" } });
  const contractor2 = await prisma.user.findUniqueOrThrow({ where: { email: "contractor2.demo@yartong.local" } });
  const supplier = await prisma.user.findUniqueOrThrow({ where: { email: "supplier.demo@yartong.local" } });
  const supplier2 = await prisma.user.findUniqueOrThrow({ where: { email: "supplier2.demo@yartong.local" } });

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
    const id = jobId(job.title);
    await prisma.job.upsert({
      where: { id },
      update: { ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
      create: { id, ...job, customerId: customer.id, publishedAt: job.status === JobStatus.PUBLISHED ? now : null, closedAt: job.status === JobStatus.CLOSED || job.status === JobStatus.CANCELLED ? now : null },
    });
  }

  const applicationSeeds = [
    ["app-masonry", "Repair kitchen water seepage", provider.id, JobProviderRole.SKILLED_PROVIDER, ApplicationStatus.ACCEPTED, 450000, 3],
    ["app-electric", "Replace damaged electrical switches", electrician.id, JobProviderRole.SKILLED_PROVIDER, ApplicationStatus.ACCEPTED, 250000, 1],
    ["app-plumbing", "Repair leaking bathroom pipe", plumber.id, JobProviderRole.SKILLED_PROVIDER, ApplicationStatus.ACCEPTED, 350000, 2],
    ["app-contractor", "Small shop renovation", contractor.id, JobProviderRole.CONTRACTOR, ApplicationStatus.ACCEPTED, 3800000, 14],
    ["app-labour-1", "Two labourers for material shifting", labourer.id, JobProviderRole.LABOURER, ApplicationStatus.SHORTLISTED, 180000, 1],
    ["app-labour-2", "Two labourers for material shifting", labourer2.id, JobProviderRole.LABOURER, ApplicationStatus.SUBMITTED, 170000, 1],
    ["app-contractor-2", "Boundary wall estimate and construction", contractor2.id, JobProviderRole.CONTRACTOR, ApplicationStatus.SUBMITTED, 1800000, 10],
    ["app-helper", "Three helpers for concrete pour", labourer.id, JobProviderRole.LABOURER, ApplicationStatus.SUBMITTED, 270000, 1],
  ] as const;

  for (const [id, title, providerId, providerRole, status, proposedPrice, proposedTimelineDays] of applicationSeeds) {
    await prisma.jobApplication.upsert({
      where: { id },
      update: { status, proposedPrice, proposedTimelineDays, message: "QA application: available, experienced, and ready to discuss the scope." },
      create: { id, jobId: jobId(title), providerId, providerRole, status, proposedPrice, proposedTimelineDays, message: "QA application: available, experienced, and ready to discuss the scope." },
    });
  }

  const engagementSeeds = [
    ["eng-masonry", "app-masonry", "Repair kitchen water seepage", provider.id, JobProviderRole.SKILLED_PROVIDER, EngagementStatus.COMPLETED, 450000, 3],
    ["eng-electric", "app-electric", "Replace damaged electrical switches", electrician.id, JobProviderRole.SKILLED_PROVIDER, EngagementStatus.COMPLETED, 250000, 1],
    ["eng-plumbing", "app-plumbing", "Repair leaking bathroom pipe", plumber.id, JobProviderRole.SKILLED_PROVIDER, EngagementStatus.COMPLETED, 350000, 2],
    ["eng-renovation", "app-contractor", "Small shop renovation", contractor.id, JobProviderRole.CONTRACTOR, EngagementStatus.IN_PROGRESS, 3800000, 14],
  ] as const;

  for (const [id, applicationId, title, providerId, providerRole, status, agreedPrice, proposedTimelineDays] of engagementSeeds) {
    const now = new Date();
    await prisma.engagement.upsert({
      where: { id },
      update: { status, agreedPrice, proposedTimelineDays, scope: `QA work order for ${title}.`, confirmedAt: now, startedAt: now, completedAt: status === EngagementStatus.COMPLETED ? now : null },
      create: { id, jobId: jobId(title), applicationId, customerId: customer.id, providerId, providerRole, status, scope: `QA work order for ${title}.`, agreedPrice, currency: "INR", proposedTimelineDays, confirmedAt: now, startedAt: now, completedAt: status === EngagementStatus.COMPLETED ? now : null },
    });
    await prisma.job.update({ where: { id: jobId(title) }, data: { status: JobStatus.CLOSED, closedAt: now } });
  }

  const conversationParticipants = [
    ["conv-masonry", "eng-masonry", provider.id],
    ["conv-electric", "eng-electric", electrician.id],
    ["conv-plumbing", "eng-plumbing", plumber.id],
    ["conv-renovation", "eng-renovation", contractor.id],
  ] as const;

  for (const [id, engagementId, providerId] of conversationParticipants) {
    await prisma.conversation.upsert({
      where: { id },
      update: { customerId: customer.id, providerId, lastMessageAt: new Date() },
      create: { id, engagementId, customerId: customer.id, providerId, lastMessageAt: new Date() },
    });
  }

  const messageSeeds = [
    ["msg-01", "conv-masonry", customer.id, "Hi, the seepage is strongest after heavy rain."],
    ["msg-02", "conv-masonry", provider.id, "Thanks. I will inspect the outside wall and the joint first."],
    ["msg-03", "conv-masonry", customer.id, "That works. Please message before arriving."],
    ["msg-04", "conv-electric", customer.id, "The switch sparks occasionally and one circuit trips."],
    ["msg-05", "conv-electric", electrician.id, "I will isolate the circuit and check the damaged fittings safely."],
    ["msg-06", "conv-electric", customer.id, "Great, thank you."],
    ["msg-07", "conv-plumbing", customer.id, "The damp patch is beside the shower wall."],
    ["msg-08", "conv-plumbing", plumber.id, "I will pressure-check the nearby line before opening the wall."],
    ["msg-09", "conv-plumbing", customer.id, "Please keep the opening as small as possible."],
    ["msg-10", "conv-renovation", contractor.id, "Partition framing is complete and paint preparation starts tomorrow."],
    ["msg-11", "conv-renovation", customer.id, "Please send an update after the first coat."],
    ["msg-12", "conv-renovation", contractor.id, "Will do. The job remains on schedule."],
  ] as const;

  for (const [id, conversationId, senderId, body] of messageSeeds) {
    await prisma.message.upsert({ where: { id }, update: { body }, create: { id, conversationId, senderId, body } });
  }

  const reviewSeeds = [
    ["review-masonry-customer", "eng-masonry", customer.id, provider.id, 5, "Careful repair", "Explained the cause clearly and finished the repair neatly."],
    ["review-masonry-provider", "eng-masonry", provider.id, customer.id, 5, "Clear scope", "Customer shared useful details and was easy to coordinate with."],
    ["review-electric-customer", "eng-electric", customer.id, electrician.id, 5, "Safe and professional", "Diagnosed the circuit issue and replaced the damaged fittings."],
    ["review-electric-provider", "eng-electric", electrician.id, customer.id, 4, "Good coordination", "Access and job details were ready when I arrived."],
    ["review-plumbing-customer", "eng-plumbing", customer.id, plumber.id, 4, "Leak fixed", "Located the leak quickly and kept wall damage limited."],
    ["review-plumbing-provider", "eng-plumbing", plumber.id, customer.id, 5, "Responsive customer", "Fast communication made the repair straightforward."],
  ] as const;

  for (const [id, engagementId, authorId, subjectId, rating, title, comment] of reviewSeeds) {
    await prisma.review.upsert({
      where: { id },
      update: { rating, title, comment, status: ReviewStatus.PUBLISHED },
      create: { id, engagementId, authorId, subjectId, rating, title, comment, status: ReviewStatus.PUBLISHED },
    });
  }

  const notificationSeeds = [
    ["note-01", customer.id, NotificationType.MESSAGE, "New message", "Demo Mason replied about the seepage repair.", "/messages/conv-masonry"],
    ["note-02", customer.id, NotificationType.ENGAGEMENT, "Work completed", "The masonry QA engagement is marked complete.", "/engagements/eng-masonry"],
    ["note-03", customer.id, NotificationType.ENGAGEMENT, "Work in progress", "The shop renovation QA engagement is in progress.", "/engagements/eng-renovation"],
    ["note-04", provider.id, NotificationType.MESSAGE, "Customer message", "The customer sent a follow-up message.", "/messages/conv-masonry"],
    ["note-05", electrician.id, NotificationType.ENGAGEMENT, "Review received", "A verified review was added after completed work.", "/providers"],
    ["note-06", plumber.id, NotificationType.ENGAGEMENT, "Review received", "A verified review was added after completed work.", "/providers"],
    ["note-07", contractor.id, NotificationType.MESSAGE, "Customer replied", "The customer requested an update after painting.", "/messages/conv-renovation"],
    ["note-08", labourer.id, NotificationType.APPLICATION, "Application shortlisted", "Your QA application was shortlisted.", "/applications"],
    ["note-09", contractor2.id, NotificationType.APPLICATION, "Application submitted", "Your boundary-wall application is active.", "/applications"],
    ["note-10", supplier.id, NotificationType.SYSTEM, "QA catalog ready", "Demo supplier catalog and stock records are available for testing.", "/supplier/products"],
  ] as const;

  for (const [id, userId, type, title, body, href] of notificationSeeds) {
    await prisma.notification.upsert({ where: { id }, update: { type, title, body, href }, create: { id, userId, type, title, body, href } });
  }

  const category = await prisma.catalogCategory.upsert({
    where: { slug: "building-materials" },
    update: { isActive: true },
    create: { id: "cat-building-materials", slug: "building-materials", name: "Building Materials", description: "QA building-material catalog root.", sortOrder: 10, isActive: true },
  });
  const hardwareCategory = await prisma.catalogCategory.upsert({
    where: { slug: "tools-hardware" },
    update: { isActive: true },
    create: { id: "cat-tools-hardware", slug: "tools-hardware", name: "Tools & Hardware", description: "QA tools and hardware catalog root.", sortOrder: 20, isActive: true },
  });
  const brand = await prisma.catalogBrand.upsert({
    where: { slug: "qa-build-brand" },
    update: { name: "QA Build Brand" },
    create: { id: "brand-qa-build", slug: "qa-build-brand", name: "QA Build Brand", countryCode: "IN" },
  });

  const catalogSeeds = [
    ["product-cement", category.id, "qa-cement-50kg", "QA Cement 50 kg", "variant-cement", "QA-CEM-50", "50 kg bag", supplier.id, "listing-cement", "SUP-CEM-50", 43000, "stock-cement", 120],
    ["product-steel", category.id, "qa-steel-tmt-12mm", "QA TMT Steel 12 mm", "variant-steel", "QA-TMT-12", "12 mm bar", supplier.id, "listing-steel", "SUP-TMT-12", 72000, "stock-steel", 85],
    ["product-sand", category.id, "qa-river-sand", "QA River Sand", "variant-sand", "QA-SAND-01", "cubic metre", supplier.id, "listing-sand", "SUP-SAND-01", 180000, "stock-sand", 24],
    ["product-screws", hardwareCategory.id, "qa-construction-screws", "QA Construction Screws", "variant-screws", "QA-SCR-100", "100 piece box", supplier2.id, "listing-screws", "HW-SCR-100", 35000, "stock-screws", 60],
    ["product-tape", hardwareCategory.id, "qa-insulation-tape", "QA Electrical Insulation Tape", "variant-tape", "QA-TAPE-01", "roll", supplier2.id, "listing-tape", "HW-TAPE-01", 6000, "stock-tape", 150],
  ] as const;

  for (const [productId, categoryId, slug, name, variantId, sku, variantName, supplierId, listingId, sellerSku, price] of catalogSeeds) {
    await prisma.catalogProduct.upsert({
      where: { id: productId },
      update: { name, categoryId, brandId: brand.id, status: CatalogProductStatus.ACTIVE },
      create: { id: productId, categoryId, brandId: brand.id, createdBySupplierId: supplierId, slug, name, description: `QA catalog item: ${name}.`, attributes: {}, status: CatalogProductStatus.ACTIVE, source: CatalogProductSource.SUPPLIER_SUBMITTED },
    });
    await prisma.catalogVariant.upsert({
      where: { id: variantId },
      update: { name: variantName, status: CatalogVariantStatus.ACTIVE },
      create: { id: variantId, productId, sku, name: variantName, unitName: variantName, unitQuantity: 1, attributes: {}, status: CatalogVariantStatus.ACTIVE },
    });
    await prisma.supplierListing.upsert({
      where: { id: listingId },
      update: { price, status: SupplierListingStatus.ACTIVE, deliveryAvailable: true },
      create: { id: listingId, supplierId, variantId, sellerSku, title: name, currency: "INR", price, minOrderQty: 1, deliveryAvailable: true, leadTimeDays: 2, status: SupplierListingStatus.ACTIVE },
    });
  }

  const supplierLocation = await prisma.inventoryLocation.upsert({
    where: { id: "inventory-demo-senapati" },
    update: { isActive: true },
    create: { id: "inventory-demo-senapati", supplierId: supplier.id, locationId: senapati.id, name: "Demo Senapati Yard", addressLine: "QA-only Senapati stock yard", isActive: true },
  });
  const supplier2Location = await prisma.inventoryLocation.upsert({
    where: { id: "inventory-demo-hardware" },
    update: { isActive: true },
    create: { id: "inventory-demo-hardware", supplierId: supplier2.id, locationId: senapati.id, name: "Demo Hardware Store", addressLine: "QA-only hardware store", isActive: true },
  });

  for (const [index, seed] of catalogSeeds.entries()) {
    const [, , , , , , , supplierId, listingId, , , stockId, onHand] = seed;
    const inventoryLocationId = supplierId === supplier.id ? supplierLocation.id : supplier2Location.id;
    await prisma.inventoryStock.upsert({
      where: { id: stockId },
      update: { onHand, reserved: 0 },
      create: { id: stockId, listingId, inventoryLocationId, onHand, reserved: 0, reorderPoint: Math.max(5, Math.floor(onHand / 5)) },
    });
    await prisma.inventoryMovement.upsert({
      where: { id: `movement-seed-${index + 1}` },
      update: { reason: "QA seed baseline stock" },
      create: { id: `movement-seed-${index + 1}`, stockId, actorId: supplierId, type: InventoryMovementType.RESTOCK, onHandDelta: onHand, reservedDelta: 0, reason: "QA seed baseline stock", reference: "QA-SEED" },
    });
  }
}

main().finally(async () => prisma.$disconnect());
