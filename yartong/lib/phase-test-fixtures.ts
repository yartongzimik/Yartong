import { Prisma, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { PublicOnboardingRole } from "@/lib/onboarding";

export const PHASE_TEST_ACCOUNTS: Record<PublicOnboardingRole, {
  email: string;
  displayName: string;
  phoneNumber: string;
  image: string;
}> = {
  CUSTOMER: {
    email: "testing.customer@phase.yartong.local",
    displayName: "Sophia Thangjam",
    phoneNumber: "+917005000101",
    image: "https://i.pravatar.cc/800?img=47",
  },
  SKILLED_PROVIDER: {
    email: "testing.provider@phase.yartong.local",
    displayName: "Rakesh Ningthoujam",
    phoneNumber: "+917005000102",
    image: "https://i.pravatar.cc/800?img=12",
  },
  LABOURER: {
    email: "testing.labourer@phase.yartong.local",
    displayName: "Peter Kamei",
    phoneNumber: "+917005000103",
    image: "https://i.pravatar.cc/800?img=11",
  },
  CONTRACTOR: {
    email: "testing.contractor@phase.yartong.local",
    displayName: "Victor Poumai",
    phoneNumber: "+917005000104",
    image: "https://i.pravatar.cc/800?img=13",
  },
  MATERIAL_SUPPLIER: {
    email: "testing.supplier@phase.yartong.local",
    displayName: "Samuel Lunghar",
    phoneNumber: "+917005000105",
    image: "https://i.pravatar.cc/800?img=14",
  },
};

export const PHASE_TEST_WORK_PHOTOS: Record<"SKILLED_PROVIDER" | "LABOURER" | "CONTRACTOR", string[]> = {
  SKILLED_PROVIDER: [
    "https://picsum.photos/seed/yartong-electric-1/900/700",
    "https://picsum.photos/seed/yartong-electric-2/900/700",
    "https://picsum.photos/seed/yartong-electric-3/900/700",
    "https://picsum.photos/seed/yartong-electric-4/900/700",
    "https://picsum.photos/seed/yartong-electric-5/900/700",
    "https://picsum.photos/seed/yartong-electric-6/900/700",
  ],
  LABOURER: [
    "https://picsum.photos/seed/yartong-labour-1/900/700",
    "https://picsum.photos/seed/yartong-labour-2/900/700",
    "https://picsum.photos/seed/yartong-labour-3/900/700",
    "https://picsum.photos/seed/yartong-labour-4/900/700",
    "https://picsum.photos/seed/yartong-labour-5/900/700",
    "https://picsum.photos/seed/yartong-labour-6/900/700",
  ],
  CONTRACTOR: [
    "https://picsum.photos/seed/yartong-contractor-1/900/700",
    "https://picsum.photos/seed/yartong-contractor-2/900/700",
    "https://picsum.photos/seed/yartong-contractor-3/900/700",
    "https://picsum.photos/seed/yartong-contractor-4/900/700",
    "https://picsum.photos/seed/yartong-contractor-5/900/700",
    "https://picsum.photos/seed/yartong-contractor-6/900/700",
  ],
};

const PROFILE_FIXTURES = {
  CUSTOMER: {
    bio: "Homeowner in Senapati testing Yartong for renovations, repairs and building-material purchases.",
    preferredLanguages: ["English", "Manipuri", "Hindi"],
  },
  SKILLED_PROVIDER: {
    businessName: "Rakesh Electrical & Repair Works",
    headline: "Licensed-style electrical installation, wiring and home repair specialist",
    bio: "Local electrical service professional with experience in new wiring, fault finding, switchboard work, lighting installation and small appliance repairs. Focused on safe work, clear estimates and clean handover.",
    experienceYears: 8,
    skills: ["Electrical wiring", "Fault finding", "Lighting", "Switchboards", "Home repairs", "Maintenance"],
    serviceRadiusKm: 35,
  },
  LABOURER: {
    headline: "Construction labourer available for site work, loading and concrete support",
    bio: "Reliable construction labourer with hands-on experience supporting masonry, concrete mixing, material movement, digging, site cleaning and general site assistance. Comfortable working with contractor teams and following safety instructions.",
    experienceYears: 6,
    skills: ["Construction labour", "Loading & unloading", "Concrete mixing", "Site cleaning", "Digging", "Material handling", "Scaffolding assistance"],
  },
  CONTRACTOR: {
    businessName: "North Hills Construction",
    headline: "Residential construction, renovation and small commercial project contractor",
    bio: "Senapati-based contractor managing residential builds, renovations, roofing and fit-out work with a local site team. Provides project coordination, labour planning, material scheduling and customer progress updates.",
    experienceYears: 11,
    teamSize: 14,
    projectTypes: ["Home construction", "Renovation", "Roofing", "Extensions", "Commercial fit-out", "Project management"],
    serviceRadiusKm: 55,
  },
  MATERIAL_SUPPLIER: {
    businessName: "Senapati BuildMart",
    headline: "Cement, steel, sand, paint and everyday construction supplies",
    bio: "Local building-material supplier serving homeowners, trades and contractors with retail and bulk orders. Delivery is available around Senapati for eligible order sizes.",
    materialCategories: ["Cement", "Steel", "Sand", "Paint", "Hardware"],
    deliveryAvailable: true,
    deliveryRadiusKm: 30,
    wholesaleAvailable: true,
  },
} as const;

async function ensureUsersAndProfiles(locationId: string) {
  const users = {} as Record<PublicOnboardingRole, { id: string }>;

  for (const role of Object.keys(PHASE_TEST_ACCOUNTS) as PublicOnboardingRole[]) {
    const account = PHASE_TEST_ACCOUNTS[role];
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        displayName: account.displayName,
        name: account.displayName,
        phoneNumber: account.phoneNumber,
        image: account.image,
        primaryRole: role,
        accountStatus: "ACTIVE",
        verificationStatus: role === "CUSTOMER" ? "PHONE_VERIFIED" : role === "MATERIAL_SUPPLIER" || role === "CONTRACTOR" ? "BUSINESS_VERIFIED" : "IDENTITY_VERIFIED",
        primaryLocationId: locationId,
        isDemo: false,
      },
      create: {
        email: account.email,
        displayName: account.displayName,
        name: account.displayName,
        phoneNumber: account.phoneNumber,
        image: account.image,
        primaryRole: role,
        accountStatus: "ACTIVE",
        verificationStatus: role === "CUSTOMER" ? "PHONE_VERIFIED" : role === "MATERIAL_SUPPLIER" || role === "CONTRACTOR" ? "BUSINESS_VERIFIED" : "IDENTITY_VERIFIED",
        primaryLocationId: locationId,
        isDemo: false,
      },
      select: { id: true },
    });
    users[role] = user;
  }

  await prisma.customerProfile.upsert({
    where: { userId: users.CUSTOMER.id },
    update: { onboardingComplete: true, ...PROFILE_FIXTURES.CUSTOMER },
    create: { userId: users.CUSTOMER.id, onboardingComplete: true, ...PROFILE_FIXTURES.CUSTOMER },
  });
  await prisma.skilledProviderProfile.upsert({
    where: { userId: users.SKILLED_PROVIDER.id },
    update: { onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.SKILLED_PROVIDER },
    create: { userId: users.SKILLED_PROVIDER.id, onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.SKILLED_PROVIDER },
  });
  await prisma.labourerProfile.upsert({
    where: { userId: users.LABOURER.id },
    update: { onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.LABOURER },
    create: { userId: users.LABOURER.id, onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.LABOURER },
  });
  await prisma.contractorProfile.upsert({
    where: { userId: users.CONTRACTOR.id },
    update: { onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.CONTRACTOR },
    create: { userId: users.CONTRACTOR.id, onboardingComplete: true, availableForWork: true, ...PROFILE_FIXTURES.CONTRACTOR },
  });
  await prisma.materialSupplierProfile.upsert({
    where: { userId: users.MATERIAL_SUPPLIER.id },
    update: { onboardingComplete: true, ...PROFILE_FIXTURES.MATERIAL_SUPPLIER },
    create: { userId: users.MATERIAL_SUPPLIER.id, onboardingComplete: true, ...PROFILE_FIXTURES.MATERIAL_SUPPLIER },
  });

  return users;
}

const providerFixtures = [
  {
    role: UserRole.SKILLED_PROVIDER,
    roleKey: "SKILLED_PROVIDER" as const,
    jobProviderRole: "SKILLED_PROVIDER" as const,
    prefix: "electric",
    titles: ["Rewire kitchen and install new sockets", "Repair intermittent power fault", "Install exterior security lights"],
    category: "Electrical",
    skills: ["Electrical wiring", "Fault finding"],
    completedScope: "Electrical inspection, safe repair and final customer handover.",
    proposedPrice: 650000,
  },
  {
    role: UserRole.LABOURER,
    roleKey: "LABOURER" as const,
    jobProviderRole: "LABOURER" as const,
    prefix: "labour",
    titles: ["Site support for retaining wall", "Concrete mixing and material handling", "Two-day site cleanup crew"],
    category: "Labour",
    skills: ["Construction labour", "Concrete mixing"],
    completedScope: "General site support, material handling and cleanup according to the agreed work plan.",
    proposedPrice: 120000,
  },
  {
    role: UserRole.CONTRACTOR,
    roleKey: "CONTRACTOR" as const,
    jobProviderRole: "CONTRACTOR" as const,
    prefix: "contract",
    titles: ["Renovate two-bedroom family home", "Replace roof and improve drainage", "Build small roadside shop extension"],
    category: "Construction",
    skills: ["Renovation", "Project management"],
    completedScope: "Managed labour, schedule, materials and site delivery through completion.",
    proposedPrice: 18500000,
  },
] as const;

async function ensureProviderActivity(users: Record<PublicOnboardingRole, { id: string }>, locationId: string) {
  const customerId = users.CUSTOMER.id;

  for (const fixture of providerFixtures) {
    const providerId = users[fixture.roleKey].id;

    for (let index = 0; index < 3; index += 1) {
      const jobId = `phase-${fixture.prefix}-job-${index + 1}`;
      const applicationId = `phase-${fixture.prefix}-application-${index + 1}`;
      const completed = index < 2;
      const inProgress = index === 2;

      await prisma.job.upsert({
        where: { id: jobId },
        update: {
          customerId,
          locationId,
          title: fixture.titles[index],
          description: `Testing fixture: ${fixture.titles[index]}. This record exists so dashboard, statistics and customer/provider flows can be tested realistically.`,
          category: fixture.category,
          skills: [...fixture.skills],
          targetProviderRoles: [fixture.jobProviderRole],
          budgetType: "RANGE",
          budgetMin: Math.round(fixture.proposedPrice * 0.8),
          budgetMax: Math.round(fixture.proposedPrice * 1.2),
          urgency: index === 2 ? "WITHIN_24_HOURS" : "STANDARD",
          status: "PUBLISHED",
          publishedAt: new Date(Date.now() - (20 - index * 5) * 86_400_000),
        },
        create: {
          id: jobId,
          customerId,
          locationId,
          title: fixture.titles[index],
          description: `Testing fixture: ${fixture.titles[index]}. This record exists so dashboard, statistics and customer/provider flows can be tested realistically.`,
          category: fixture.category,
          skills: [...fixture.skills],
          targetProviderRoles: [fixture.jobProviderRole],
          budgetType: "RANGE",
          budgetMin: Math.round(fixture.proposedPrice * 0.8),
          budgetMax: Math.round(fixture.proposedPrice * 1.2),
          urgency: index === 2 ? "WITHIN_24_HOURS" : "STANDARD",
          status: "PUBLISHED",
          publishedAt: new Date(Date.now() - (20 - index * 5) * 86_400_000),
        },
      });

      await prisma.jobApplication.upsert({
        where: { id: applicationId },
        update: {
          jobId,
          providerId,
          providerRole: fixture.jobProviderRole,
          message: "I am available for this work and can confirm the scope, timing and site requirements with you.",
          proposedPrice: fixture.proposedPrice,
          proposedTimelineDays: fixture.roleKey === "CONTRACTOR" ? 28 : 3,
          status: "ACCEPTED",
        },
        create: {
          id: applicationId,
          jobId,
          providerId,
          providerRole: fixture.jobProviderRole,
          message: "I am available for this work and can confirm the scope, timing and site requirements with you.",
          proposedPrice: fixture.proposedPrice,
          proposedTimelineDays: fixture.roleKey === "CONTRACTOR" ? 28 : 3,
          status: "ACCEPTED",
        },
      });

      const engagementId = `phase-${fixture.prefix}-engagement-${index + 1}`;
      await prisma.engagement.upsert({
        where: { id: engagementId },
        update: {
          jobId,
          applicationId,
          customerId,
          providerId,
          providerRole: fixture.jobProviderRole,
          scope: fixture.completedScope,
          agreedPrice: fixture.proposedPrice,
          proposedTimelineDays: fixture.roleKey === "CONTRACTOR" ? 28 : 3,
          status: completed ? "COMPLETED" : "IN_PROGRESS",
          confirmedAt: new Date(Date.now() - (18 - index * 4) * 86_400_000),
          startedAt: new Date(Date.now() - (17 - index * 4) * 86_400_000),
          completedAt: completed ? new Date(Date.now() - (12 - index * 4) * 86_400_000) : null,
        },
        create: {
          id: engagementId,
          jobId,
          applicationId,
          customerId,
          providerId,
          providerRole: fixture.jobProviderRole,
          scope: fixture.completedScope,
          agreedPrice: fixture.proposedPrice,
          proposedTimelineDays: fixture.roleKey === "CONTRACTOR" ? 28 : 3,
          status: completed ? "COMPLETED" : "IN_PROGRESS",
          confirmedAt: new Date(Date.now() - (18 - index * 4) * 86_400_000),
          startedAt: new Date(Date.now() - (17 - index * 4) * 86_400_000),
          completedAt: completed ? new Date(Date.now() - (12 - index * 4) * 86_400_000) : null,
        },
      });

      if (completed) {
        await prisma.review.upsert({
          where: { engagementId_authorId: { engagementId, authorId: customerId } },
          update: {
            subjectId: providerId,
            rating: index === 0 ? 5 : 4,
            title: index === 0 ? "Reliable and professional" : "Good work and communication",
            comment: index === 0
              ? "Arrived as agreed, communicated clearly and completed the work carefully. I would hire this provider again."
              : "Good quality work and cooperative throughout the job. The final handover was clear and tidy.",
            status: "PUBLISHED",
          },
          create: {
            id: `phase-${fixture.prefix}-review-${index + 1}`,
            engagementId,
            authorId: customerId,
            subjectId: providerId,
            rating: index === 0 ? 5 : 4,
            title: index === 0 ? "Reliable and professional" : "Good work and communication",
            comment: index === 0
              ? "Arrived as agreed, communicated clearly and completed the work carefully. I would hire this provider again."
              : "Good quality work and cooperative throughout the job. The final handover was clear and tidy.",
            status: "PUBLISHED",
          },
        });
      }

      if (inProgress) {
        const conversationId = `phase-${fixture.prefix}-conversation`;
        await prisma.conversation.upsert({
          where: { engagementId },
          update: { customerId, providerId, lastMessageAt: new Date() },
          create: { id: conversationId, engagementId, customerId, providerId, lastMessageAt: new Date() },
        });
        await prisma.message.upsert({
          where: { id: `phase-${fixture.prefix}-message-1` },
          update: { conversationId, senderId: customerId, body: "Hi, please confirm tomorrow's site timing when you are free.", readAt: null },
          create: { id: `phase-${fixture.prefix}-message-1`, conversationId, senderId: customerId, body: "Hi, please confirm tomorrow's site timing when you are free.", readAt: null },
        });
        await prisma.message.upsert({
          where: { id: `phase-${fixture.prefix}-message-2` },
          update: { conversationId, senderId: providerId, body: "Confirmed. I will be there at 8:30 AM and will bring the required tools.", readAt: new Date() },
          create: { id: `phase-${fixture.prefix}-message-2`, conversationId, senderId: providerId, body: "Confirmed. I will be there at 8:30 AM and will bring the required tools.", readAt: new Date() },
        });
      }
    }

    const openJobId = `phase-${fixture.prefix}-open-job`;
    await prisma.job.upsert({
      where: { id: openJobId },
      update: {
        customerId,
        locationId,
        title: `New ${fixture.category.toLowerCase()} opportunity in Senapati`,
        description: "Testing fixture for a submitted application that has not yet been accepted.",
        category: fixture.category,
        skills: [...fixture.skills],
        targetProviderRoles: [fixture.jobProviderRole],
        budgetType: "NEGOTIABLE",
        urgency: "STANDARD",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      create: {
        id: openJobId,
        customerId,
        locationId,
        title: `New ${fixture.category.toLowerCase()} opportunity in Senapati`,
        description: "Testing fixture for a submitted application that has not yet been accepted.",
        category: fixture.category,
        skills: [...fixture.skills],
        targetProviderRoles: [fixture.jobProviderRole],
        budgetType: "NEGOTIABLE",
        urgency: "STANDARD",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    await prisma.jobApplication.upsert({
      where: { id: `phase-${fixture.prefix}-open-application` },
      update: {
        jobId: openJobId,
        providerId,
        providerRole: fixture.jobProviderRole,
        message: "Interested and available to discuss the work.",
        proposedPrice: fixture.proposedPrice,
        status: "SUBMITTED",
      },
      create: {
        id: `phase-${fixture.prefix}-open-application`,
        jobId: openJobId,
        providerId,
        providerRole: fixture.jobProviderRole,
        message: "Interested and available to discuss the work.",
        proposedPrice: fixture.proposedPrice,
        status: "SUBMITTED",
      },
    });
  }
}

const supplierProducts = [
  { key: "cement", category: "Cement", name: "Premium PPC Cement 50 kg", unit: "bag", price: 43000, stock: "145" },
  { key: "steel", category: "Steel", name: "TMT Steel Bar 12 mm", unit: "piece", price: 78000, stock: "86" },
  { key: "sand", category: "Sand", name: "Washed River Sand", unit: "cubic ft", price: 6500, stock: "420" },
  { key: "paint", category: "Paint", name: "Exterior Weather Paint 20 L", unit: "bucket", price: 365000, stock: "32" },
] as const;

async function ensureSupplierInventory(users: Record<PublicOnboardingRole, { id: string }>, locationId: string) {
  const supplierId = users.MATERIAL_SUPPLIER.id;
  const inventoryLocation = await prisma.inventoryLocation.upsert({
    where: { supplierId_name: { supplierId, name: "Senapati Main Yard" } },
    update: { locationId, addressLine: "NH-2, Senapati, Manipur", isActive: true },
    create: { id: "phase-supplier-yard", supplierId, locationId, name: "Senapati Main Yard", addressLine: "NH-2, Senapati, Manipur", isActive: true },
  });

  for (const item of supplierProducts) {
    const category = await prisma.catalogCategory.upsert({
      where: { slug: `phase-${item.key}` },
      update: { name: item.category, description: `Testing ${item.category.toLowerCase()} category`, isActive: true },
      create: { id: `phase-category-${item.key}`, slug: `phase-${item.key}`, name: item.category, description: `Testing ${item.category.toLowerCase()} category`, isActive: true },
    });
    const product = await prisma.catalogProduct.upsert({
      where: { slug: `phase-${item.key}-product` },
      update: { categoryId: category.id, createdBySupplierId: supplierId, name: item.name, description: `${item.name} testing catalogue product for supplier marketplace UI.`, status: "ACTIVE", source: "SUPPLIER_SUBMITTED" },
      create: { id: `phase-product-${item.key}`, categoryId: category.id, createdBySupplierId: supplierId, slug: `phase-${item.key}-product`, name: item.name, description: `${item.name} testing catalogue product for supplier marketplace UI.`, status: "ACTIVE", source: "SUPPLIER_SUBMITTED", attributes: {} as Prisma.InputJsonValue },
    });
    const variant = await prisma.catalogVariant.upsert({
      where: { sku: `PHASE-${item.key.toUpperCase()}-001` },
      update: { productId: product.id, name: item.name, unitName: item.unit, unitQuantity: "1", status: "ACTIVE" },
      create: { id: `phase-variant-${item.key}`, productId: product.id, sku: `PHASE-${item.key.toUpperCase()}-001`, name: item.name, unitName: item.unit, unitQuantity: "1", status: "ACTIVE", attributes: {} as Prisma.InputJsonValue },
    });
    const listing = await prisma.supplierListing.upsert({
      where: { supplierId_sellerSku: { supplierId, sellerSku: `SBM-${item.key.toUpperCase()}-001` } },
      update: { variantId: variant.id, title: item.name, description: `Available from Senapati BuildMart. Testing listing with delivery and inventory enabled.`, price: item.price, deliveryAvailable: true, leadTimeDays: 1, status: "ACTIVE" },
      create: { id: `phase-listing-${item.key}`, supplierId, variantId: variant.id, sellerSku: `SBM-${item.key.toUpperCase()}-001`, title: item.name, description: `Available from Senapati BuildMart. Testing listing with delivery and inventory enabled.`, price: item.price, deliveryAvailable: true, leadTimeDays: 1, status: "ACTIVE", minOrderQty: "1" },
    });
    await prisma.inventoryStock.upsert({
      where: { listingId_inventoryLocationId: { listingId: listing.id, inventoryLocationId: inventoryLocation.id } },
      update: { onHand: item.stock, reserved: "4", reorderPoint: "20" },
      create: { id: `phase-stock-${item.key}`, listingId: listing.id, inventoryLocationId: inventoryLocation.id, onHand: item.stock, reserved: "4", reorderPoint: "20" },
    });
  }
}

export async function ensurePhaseTestingFixtures() {
  const location = await prisma.location.upsert({
    where: { slug: "senapati" },
    update: { name: "Senapati", district: "Senapati", state: "Manipur", country: "India", isActive: true, isPrimary: true },
    create: { slug: "senapati", name: "Senapati", district: "Senapati", state: "Manipur", country: "India", isActive: true, isPrimary: true },
    select: { id: true },
  });

  const users = await ensureUsersAndProfiles(location.id);
  await ensureProviderActivity(users, location.id);
  await ensureSupplierInventory(users, location.id);
  return users;
}
