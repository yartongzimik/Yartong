import type {
  BusinessAnalytics,
  ContractorProfile,
  CustomerProfile,
  Job,
  LabourerProfile,
  Location,
  MaterialCategory,
  MaterialProduct,
  MaterialSupplierProfile,
  MembershipPlan,
  Notification,
  QuickJob,
  Review,
  SkilledProviderProfile,
  TradeCategory,
  User,
} from "./types";

/**
 * Development-only mock data.
 *
 * This file lets us build and test Yartong pages before connecting
 * PostgreSQL and Prisma. It should not contain real personal information.
 */

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "location-senapati-town",
    name: "Senapati Town",
    district: "Senapati",
    state: "Manipur",
    country: "India",
    pincode: "795106",
    isActive: true,
  },
  {
    id: "location-mao",
    name: "Mao",
    district: "Senapati",
    state: "Manipur",
    country: "India",
    pincode: "795150",
    isActive: true,
  },
  {
    id: "location-paomata",
    name: "Paomata",
    district: "Senapati",
    state: "Manipur",
    country: "India",
    isActive: true,
  },
  {
    id: "location-purul",
    name: "Purul",
    district: "Senapati",
    state: "Manipur",
    country: "India",
    isActive: true,
  },
];

export const MOCK_TRADE_CATEGORIES: TradeCategory[] = [
  {
    id: "trade-masonry",
    name: "Masonry",
    slug: "masonry",
    description:
      "Brickwork, concrete work, plastering and structural repairs.",
    icon: "brick-wall",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "trade-carpentry",
    name: "Carpentry",
    slug: "carpentry",
    description:
      "Furniture, doors, windows, roofing and general woodwork.",
    icon: "hammer",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "trade-electrical",
    name: "Electrical",
    slug: "electrical",
    description:
      "Electrical installation, wiring, repairs and maintenance.",
    icon: "zap",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "trade-plumbing",
    name: "Plumbing",
    slug: "plumbing",
    description:
      "Water supply, drainage, pipe installation and repairs.",
    icon: "wrench",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "trade-painting",
    name: "Painting",
    slug: "painting",
    description:
      "Interior, exterior, decorative and protective painting.",
    icon: "paint-roller",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "trade-welding",
    name: "Welding",
    slug: "welding",
    description:
      "Metal fabrication, gates, railings and structural welding.",
    icon: "flame",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "trade-roofing",
    name: "Roofing",
    slug: "roofing",
    description:
      "Roof installation, repair, waterproofing and maintenance.",
    icon: "home",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "trade-tiling",
    name: "Tiling",
    slug: "tiling",
    description:
      "Floor tiles, wall tiles, stone and finishing work.",
    icon: "grid",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "trade-false-ceiling",
    name: "False Ceiling",
    slug: "false-ceiling",
    description:
      "False-ceiling installation, repair and interior finishing.",
    icon: "layers",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "trade-glass-work",
    name: "Glass Work",
    slug: "glass-work",
    description:
      "Windows, partitions, mirrors, glazing and glass installation.",
    icon: "square",
    isActive: true,
    sortOrder: 10,
  },
];

export const MOCK_MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: "material-category-cement",
    name: "Cement",
    slug: "cement",
    description: "Construction cement for masonry and concrete work.",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "material-category-steel",
    name: "Steel and Rebar",
    slug: "steel-rebar",
    description: "TMT bars, structural steel and reinforcement materials.",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "material-category-glass",
    name: "Glass",
    slug: "glass",
    description: "Window glass, mirrors and architectural glass products.",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "material-category-false-ceiling",
    name: "False Ceiling",
    slug: "false-ceiling",
    description: "Ceiling boards, channels, grids and accessories.",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "material-category-plumbing",
    name: "Plumbing Materials",
    slug: "plumbing-materials",
    description: "Pipes, fittings, tanks, taps and drainage materials.",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "material-category-electrical",
    name: "Electrical Materials",
    slug: "electrical-materials",
    description: "Wires, switches, lighting and electrical accessories.",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "material-category-paint",
    name: "Paint and Finishing",
    slug: "paint-finishing",
    description: "Paints, primers, putty and decorative finishes.",
    isActive: true,
    sortOrder: 7,
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "user-customer-001",
    role: "CUSTOMER",
    displayName: "Athing K",
    email: "athing@example.com",
    phoneNumber: "+91 90000 00001",
    accountStatus: "ACTIVE",
    verificationStatus: "PHONE_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-04-12T09:30:00.000Z",
    updatedAt: "2026-07-12T14:10:00.000Z",
    lastActiveAt: "2026-07-15T16:00:00.000Z",
  },
  {
    id: "user-provider-001",
    role: "SKILLED_PROVIDER",
    displayName: "K. John",
    email: "john@example.com",
    phoneNumber: "+91 90000 00002",
    accountStatus: "ACTIVE",
    verificationStatus: "YARTONG_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-07-14T11:45:00.000Z",
    lastActiveAt: "2026-07-15T15:42:00.000Z",
  },
  {
    id: "user-provider-002",
    role: "SKILLED_PROVIDER",
    displayName: "R. David",
    email: "david@example.com",
    phoneNumber: "+91 90000 00003",
    accountStatus: "ACTIVE",
    verificationStatus: "IDENTITY_VERIFIED",
    location: MOCK_LOCATIONS[1],
    createdAt: "2026-03-15T08:20:00.000Z",
    updatedAt: "2026-07-10T12:25:00.000Z",
    lastActiveAt: "2026-07-15T14:10:00.000Z",
  },
  {
    id: "user-labourer-001",
    role: "LABOURER",
    displayName: "M. Kopa",
    phoneNumber: "+91 90000 00004",
    accountStatus: "ACTIVE",
    verificationStatus: "IDENTITY_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-05-01T07:15:00.000Z",
    updatedAt: "2026-07-13T09:00:00.000Z",
    lastActiveAt: "2026-07-15T13:30:00.000Z",
  },
  {
    id: "user-contractor-001",
    role: "CONTRACTOR",
    displayName: "Apei Construction",
    email: "apei@example.com",
    phoneNumber: "+91 90000 00005",
    accountStatus: "ACTIVE",
    verificationStatus: "BUSINESS_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-07-14T10:00:00.000Z",
    lastActiveAt: "2026-07-15T17:05:00.000Z",
  },
  {
    id: "user-supplier-001",
    role: "MATERIAL_SUPPLIER",
    displayName: "Senapati Building Centre",
    email: "sbc@example.com",
    phoneNumber: "+91 90000 00006",
    accountStatus: "ACTIVE",
    verificationStatus: "BUSINESS_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-02-18T09:00:00.000Z",
    updatedAt: "2026-07-15T11:00:00.000Z",
    lastActiveAt: "2026-07-15T16:20:00.000Z",
  },
  {
    id: "user-supplier-002",
    role: "MATERIAL_SUPPLIER",
    displayName: "Hills Steel and Hardware",
    email: "hillssteel@example.com",
    phoneNumber: "+91 90000 00007",
    accountStatus: "ACTIVE",
    verificationStatus: "YARTONG_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-07-14T12:30:00.000Z",
    lastActiveAt: "2026-07-15T17:20:00.000Z",
  },
  {
    id: "user-admin-001",
    role: "ADMIN",
    displayName: "Yartong Administrator",
    email: "admin@yartong.com",
    phoneNumber: "+91 90000 00008",
    accountStatus: "ACTIVE",
    verificationStatus: "YARTONG_VERIFIED",
    location: MOCK_LOCATIONS[0],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-07-15T12:00:00.000Z",
    lastActiveAt: "2026-07-15T17:45:00.000Z",
  },
];

export const MOCK_CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    id: "customer-profile-001",
    userId: "user-customer-001",
    isVerifiedBuyer: true,
    membershipPlanId: "membership-customer-plus",
    savedProviderIds: [
      "provider-profile-001",
      "contractor-profile-001",
    ],
    savedSupplierIds: ["supplier-profile-001"],
    savedMaterialIds: [
      "material-product-cement-001",
      "material-product-rebar-001",
    ],
    jobsPosted: 8,
    completedJobs: 5,
    reviewsGiven: 4,
  },
];

export const MOCK_SKILLED_PROVIDER_PROFILES: SkilledProviderProfile[] = [
  {
    id: "provider-profile-001",
    userId: "user-provider-001",
    yartongBusinessId: "YB-000101",
    businessHealthScore: 86,
    businessName: "John Carpentry Works",
    headline: "Professional carpenter for residential and custom woodwork",
    biography:
      "Experienced in doors, windows, furniture repair, roofing woodwork and custom interior projects.",
    availabilityStatus: "AVAILABLE",
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
    ],
    services: [
      {
        id: "provider-service-001",
        providerId: "provider-profile-001",
        tradeCategoryId: "trade-carpentry",
        name: "Carpentry and Furniture",
        description:
          "Furniture repairs, doors, windows and custom woodwork.",
        skillLevel: "LEVEL_3_PROFESSIONAL",
        yearsOfExperience: 8,
        pricingMethods: [
          "DAILY",
          "STARTING_PRICE",
          "QUOTE_REQUIRED",
        ],
        dailyRate: 1800,
        startingPrice: 800,
        isPrimaryService: true,
        isActive: true,
      },
      {
        id: "provider-service-002",
        providerId: "provider-profile-001",
        tradeCategoryId: "trade-roofing",
        name: "Roofing Woodwork",
        description:
          "Timber framing and roof-support carpentry.",
        skillLevel: "LEVEL_2_SKILLED",
        yearsOfExperience: 5,
        pricingMethods: [
          "DAILY",
          "QUOTE_REQUIRED",
        ],
        dailyRate: 1800,
        isPrimaryService: false,
        isActive: true,
      },
    ],
    trustScore: 91,
    averageRating: 4.8,
    totalReviews: 47,
    completedJobs: 54,
    profileViews: 1248,
    searchAppearances: 3580,
    contactRequests: 126,
    averageResponseMinutes: 18,
    acceptanceRate: 84,
    completionRate: 96,
    repeatCustomerRate: 38,
    portfolioItems: [
      {
        id: "portfolio-provider-001",
        ownerId: "provider-profile-001",
        title: "Custom wooden entrance door",
        description:
          "Designed, built and installed a custom hardwood entrance door.",
        imageUrls: [
          "/placeholders/project-placeholder.svg",
        ],
        tradeCategoryId: "trade-carpentry",
        locationName: "Senapati Town",
        completedAt: "2026-06-20T00:00:00.000Z",
        createdAt: "2026-06-22T09:00:00.000Z",
      },
      {
        id: "portfolio-provider-002",
        ownerId: "provider-profile-001",
        title: "Residential roof timber frame",
        description:
          "Timber roof-frame work for a two-storey residential building.",
        imageUrls: [
          "/placeholders/project-placeholder.svg",
        ],
        tradeCategoryId: "trade-roofing",
        locationName: "Mao",
        completedAt: "2026-05-18T00:00:00.000Z",
        createdAt: "2026-05-20T09:00:00.000Z",
      },
    ],
  },
  {
    id: "provider-profile-002",
    userId: "user-provider-002",
    yartongBusinessId: "YB-000102",
    businessHealthScore: 73,
    headline: "Plumbing installation and household repair services",
    biography:
      "Providing pipe installation, leakage repair, water-tank fitting and drainage services.",
    availabilityStatus: "LIMITED",
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
    ],
    services: [
      {
        id: "provider-service-003",
        providerId: "provider-profile-002",
        tradeCategoryId: "trade-plumbing",
        name: "Plumbing Services",
        description:
          "Pipe fitting, leakage repair and water-system installation.",
        skillLevel: "LEVEL_2_SKILLED",
        yearsOfExperience: 4,
        pricingMethods: [
          "HOURLY",
          "DAILY",
          "QUOTE_REQUIRED",
        ],
        hourlyRate: 450,
        dailyRate: 1400,
        isPrimaryService: true,
        isActive: true,
      },
    ],
    trustScore: 82,
    averageRating: 4.6,
    totalReviews: 26,
    completedJobs: 31,
    profileViews: 760,
    searchAppearances: 2180,
    contactRequests: 74,
    averageResponseMinutes: 31,
    acceptanceRate: 79,
    completionRate: 92,
    repeatCustomerRate: 24,
    portfolioItems: [
      {
        id: "portfolio-provider-003",
        ownerId: "provider-profile-002",
        title: "Residential water-tank installation",
        description:
          "Installed tank, supply lines and household distribution pipes.",
        imageUrls: [
          "/placeholders/project-placeholder.svg",
        ],
        tradeCategoryId: "trade-plumbing",
        locationName: "Senapati Town",
        completedAt: "2026-06-01T00:00:00.000Z",
        createdAt: "2026-06-02T09:00:00.000Z",
      },
    ],
  },
];

export const MOCK_LABOURER_PROFILES: LabourerProfile[] = [
  {
    id: "labourer-profile-001",
    userId: "user-labourer-001",
    workCategories: [
      "General Construction",
      "Loading and Unloading",
      "Masonry Assistance",
      "Site Cleaning",
    ],
    availabilityStatus: "AVAILABLE",
    employmentPreference: "FLEXIBLE",
    expectedDailyWage: 850,
    acceptsContractWork: true,
    attendanceScore: 92,
    punctualityScore: 88,
    reliabilityScore: 90,
    averageRating: 4.5,
    completedJobs: 42,
    daysWorked: 76,
    rehireRate: 41,
    managedByYartong: true,
    businessHealthScore: 84,
  },
];

export const MOCK_CONTRACTOR_PROFILES: ContractorProfile[] = [
  {
    id: "contractor-profile-001",
    userId: "user-contractor-001",
    yartongBusinessId: "YB-000201",
    businessHealthScore: 89,
    businessName: "Apei Construction",
    headline: "Residential construction and renovation contractor",
    description:
      "Managing residential construction, renovations, roofing and project teams across Senapati.",
    teamSize: 18,
    yearsInBusiness: 11,
    tradeCategoryIds: [
      "trade-masonry",
      "trade-carpentry",
      "trade-electrical",
      "trade-plumbing",
      "trade-roofing",
    ],
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
      "location-paomata",
    ],
    minimumProjectValue: 100000,
    maximumProjectValue: 15000000,
    availabilityStatus: "LIMITED",
    completedProjects: 86,
    activeProjects: 4,
    averageRating: 4.9,
    trustScore: 94,
    profileViews: 2860,
    quotationRequests: 194,
    conversionRate: 37,
    portfolioItems: [
      {
        id: "portfolio-contractor-001",
        ownerId: "contractor-profile-001",
        title: "Two-storey residential construction",
        description:
          "Complete construction from foundation to interior finishing.",
        imageUrls: [
          "/placeholders/project-placeholder.svg",
        ],
        locationName: "Senapati Town",
        completedAt: "2026-04-30T00:00:00.000Z",
        createdAt: "2026-05-04T09:00:00.000Z",
      },
      {
        id: "portfolio-contractor-002",
        ownerId: "contractor-profile-001",
        title: "Commercial building renovation",
        description:
          "Structural repair, electrical upgrade and interior renovation.",
        imageUrls: [
          "/placeholders/project-placeholder.svg",
        ],
        locationName: "Mao",
        completedAt: "2026-03-25T00:00:00.000Z",
        createdAt: "2026-03-29T09:00:00.000Z",
      },
    ],
  },
];

export const MOCK_MATERIAL_SUPPLIER_PROFILES: MaterialSupplierProfile[] = [
  {
    id: "supplier-profile-001",
    userId: "user-supplier-001",
    yartongBusinessId: "YB-000301",
    businessHealthScore: 81,
    businessGrowthScore: 91,
    businessName: "Senapati Building Centre",
    description:
      "Retail and wholesale supplier of cement, roofing, plumbing and general construction materials.",
    businessType: "RETAILER",
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
      "location-paomata",
    ],
    offersRetail: true,
    offersWholesale: true,
    offersDelivery: true,
    minimumOrderValue: 1000,
    productCount: 64,
    profileViews: 1980,
    productViews: 6940,
    quotationRequests: 185,
    acceptedQuotations: 76,
    completedOrders: 68,
    averageRating: 4.7,
    responseRate: 91,
    conversionRate: 41,
    repeatCustomerRate: 34,
  },
  {
    id: "supplier-profile-002",
    userId: "user-supplier-002",
    yartongBusinessId: "YB-000302",
    businessHealthScore: 88,
    businessGrowthScore: 84,
    businessName: "Hills Steel and Hardware",
    description:
      "Supplier of steel, rebar, structural sections, hardware and fabrication materials.",
    businessType: "WHOLESALER",
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
      "location-purul",
    ],
    offersRetail: true,
    offersWholesale: true,
    offersDelivery: true,
    minimumOrderValue: 3000,
    productCount: 42,
    profileViews: 2450,
    productViews: 8120,
    quotationRequests: 237,
    acceptedQuotations: 112,
    completedOrders: 96,
    averageRating: 4.8,
    responseRate: 95,
    conversionRate: 47,
    repeatCustomerRate: 43,
  },
];

export const MOCK_MATERIAL_PRODUCTS: MaterialProduct[] = [
  {
    id: "material-product-cement-001",
    supplierId: "supplier-profile-001",
    categoryId: "material-category-cement",
    name: "OPC Cement 50 kg",
    slug: "opc-cement-50kg",
    brand: "Sample Brand",
    description:
      "Ordinary Portland cement suitable for masonry and concrete construction.",
    imageUrls: [
      "/placeholders/material-placeholder.svg",
    ],
    unit: "BAG",
    priceType: "FIXED",
    retailPrice: 430,
    wholesalePrice: 410,
    minimumOrderQuantity: 1,
    stockStatus: "IN_STOCK",
    availableQuantity: 580,
    deliveryAvailable: true,
    deliveryCharge: 500,
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
    ],
    lastPriceUpdatedAt: "2026-07-14T09:00:00.000Z",
    isActive: true,
    isFeatured: true,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-07-14T09:00:00.000Z",
  },
  {
    id: "material-product-rebar-001",
    supplierId: "supplier-profile-002",
    categoryId: "material-category-steel",
    name: "12 mm TMT Rebar",
    slug: "12mm-tmt-rebar",
    brand: "Sample Steel",
    description:
      "High-strength 12 mm TMT reinforcement bar for structural concrete work.",
    imageUrls: [
      "/placeholders/material-placeholder.svg",
    ],
    unit: "PIECE",
    priceType: "QUOTE_REQUIRED",
    minimumOrderQuantity: 10,
    stockStatus: "IN_STOCK",
    availableQuantity: 860,
    deliveryAvailable: true,
    deliveryCharge: 1200,
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
      "location-purul",
    ],
    lastPriceUpdatedAt: "2026-07-15T08:30:00.000Z",
    isActive: true,
    isFeatured: true,
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-07-15T08:30:00.000Z",
  },
  {
    id: "material-product-ceiling-001",
    supplierId: "supplier-profile-001",
    categoryId: "material-category-false-ceiling",
    name: "False Ceiling GI Channel",
    slug: "false-ceiling-gi-channel",
    description:
      "Galvanised iron channel for false-ceiling framework installation.",
    imageUrls: [
      "/placeholders/material-placeholder.svg",
    ],
    unit: "PIECE",
    priceType: "STARTING_FROM",
    retailPrice: 185,
    minimumOrderQuantity: 5,
    stockStatus: "AVAILABLE_ON_ORDER",
    deliveryAvailable: true,
    serviceLocationIds: [
      "location-senapati-town",
    ],
    lastPriceUpdatedAt: "2026-07-10T11:00:00.000Z",
    expectedRestockAt: "2026-07-20T00:00:00.000Z",
    isActive: true,
    isFeatured: false,
    createdAt: "2026-05-05T09:00:00.000Z",
    updatedAt: "2026-07-10T11:00:00.000Z",
  },
  {
    id: "material-product-pipe-001",
    supplierId: "supplier-profile-001",
    categoryId: "material-category-plumbing",
    name: "PVC Pipe 25 mm",
    slug: "pvc-pipe-25mm",
    description:
      "PVC water-supply pipe suitable for residential plumbing installations.",
    imageUrls: [
      "/placeholders/material-placeholder.svg",
    ],
    unit: "PIECE",
    priceType: "FIXED",
    retailPrice: 320,
    wholesalePrice: 295,
    minimumOrderQuantity: 1,
    stockStatus: "LOW_STOCK",
    availableQuantity: 24,
    deliveryAvailable: true,
    deliveryCharge: 300,
    serviceLocationIds: [
      "location-senapati-town",
      "location-mao",
    ],
    lastPriceUpdatedAt: "2026-07-12T10:00:00.000Z",
    isActive: true,
    isFeatured: false,
    createdAt: "2026-05-08T09:00:00.000Z",
    updatedAt: "2026-07-12T10:00:00.000Z",
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-001",
    customerId: "user-customer-001",
    title: "Repair front staircase",
    description:
      "Repair damaged concrete steps and apply a clean cement finish.",
    tradeCategoryId: "trade-masonry",
    requiredSkillLevel: "LEVEL_2_SKILLED",
    locationId: "location-senapati-town",
    pincode: "795106",
    preferredDate: "2026-07-18",
    urgency: "STANDARD",
    estimatedBudgetMin: 5000,
    estimatedBudgetMax: 9000,
    paymentType: "PROJECT_QUOTE",
    numberOfWorkers: 2,
    expectedDuration: "2 days",
    imageUrls: [
      "/placeholders/project-placeholder.svg",
    ],
    status: "PUBLISHED",
    createdAt: "2026-07-15T09:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
  },
  {
    id: "job-002",
    customerId: "user-customer-001",
    title: "Install water tank and supply pipe",
    description:
      "Install a rooftop water tank and connect the main household supply.",
    tradeCategoryId: "trade-plumbing",
    requiredSkillLevel: "LEVEL_3_PROFESSIONAL",
    locationId: "location-mao",
    pincode: "795150",
    preferredDate: "2026-07-22",
    urgency: "STANDARD",
    estimatedBudgetMin: 12000,
    estimatedBudgetMax: 18000,
    paymentType: "PROJECT_QUOTE",
    numberOfWorkers: 1,
    expectedDuration: "2 to 3 days",
    imageUrls: [],
    status: "MATCHING",
    createdAt: "2026-07-14T08:30:00.000Z",
    updatedAt: "2026-07-15T10:00:00.000Z",
  },
];

export const MOCK_QUICK_JOBS: QuickJob[] = [
  {
    id: "quick-job-001",
    customerId: "user-customer-001",
    title: "Fix leaking kitchen tap",
    description:
      "Kitchen tap is leaking continuously and requires urgent repair.",
    tradeCategoryId: "trade-plumbing",
    requiredSkillLevel: "LEVEL_2_SKILLED",
    locationId: "location-senapati-town",
    pincode: "795106",
    preferredDate: "2026-07-16",
    urgency: "WITHIN_24_HOURS",
    estimatedBudgetMin: 500,
    estimatedBudgetMax: 1500,
    paymentType: "PROJECT_QUOTE",
    numberOfWorkers: 1,
    expectedDuration: "UNDER_2_HOURS",
    imageUrls: [],
    status: "PUBLISHED",
    isQuickJob: true,
    createdAt: "2026-07-15T16:00:00.000Z",
    updatedAt: "2026-07-15T16:00:00.000Z",
  },
  {
    id: "quick-job-002",
    customerId: "user-customer-001",
    title: "Install two ceiling fans",
    description:
      "Install two ceiling fans in completed electrical points.",
    tradeCategoryId: "trade-electrical",
    requiredSkillLevel: "LEVEL_2_SKILLED",
    locationId: "location-senapati-town",
    pincode: "795106",
    preferredDate: "2026-07-17",
    urgency: "STANDARD",
    estimatedBudgetMin: 1000,
    estimatedBudgetMax: 2500,
    paymentType: "FIXED_PRICE",
    numberOfWorkers: 1,
    expectedDuration: "HALF_DAY",
    imageUrls: [],
    status: "PUBLISHED",
    isQuickJob: true,
    createdAt: "2026-07-15T13:00:00.000Z",
    updatedAt: "2026-07-15T13:00:00.000Z",
  },
  {
    id: "quick-job-003",
    customerId: "user-customer-001",
    title: "One-day material loading assistance",
    description:
      "Need two labourers to unload cement and steel at a residential site.",
    tradeCategoryId: "trade-masonry",
    locationId: "location-senapati-town",
    pincode: "795106",
    preferredDate: "2026-07-18",
    urgency: "STANDARD",
    estimatedBudgetMin: 1600,
    estimatedBudgetMax: 2200,
    paymentType: "DAILY_WAGE",
    numberOfWorkers: 2,
    expectedDuration: "FULL_DAY",
    imageUrls: [],
    status: "PUBLISHED",
    isQuickJob: true,
    createdAt: "2026-07-15T11:00:00.000Z",
    updatedAt: "2026-07-15T11:00:00.000Z",
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review-001",
    reviewerId: "user-customer-001",
    targetUserId: "user-provider-001",
    jobId: "job-001",
    overallRating: 5,
    qualityRating: 5,
    punctualityRating: 4,
    communicationRating: 5,
    priceFairnessRating: 4,
    title: "Very good finishing work",
    comment:
      "The work was completed carefully and communication was excellent.",
    status: "PUBLISHED",
    createdAt: "2026-06-24T12:00:00.000Z",
  },
  {
    id: "review-002",
    reviewerId: "user-customer-001",
    targetUserId: "user-contractor-001",
    overallRating: 5,
    qualityRating: 5,
    punctualityRating: 5,
    communicationRating: 5,
    priceFairnessRating: 4,
    title: "Professional project management",
    comment:
      "The contractor provided clear updates and managed the workers properly.",
    status: "PUBLISHED",
    createdAt: "2026-05-05T12:00:00.000Z",
  },
  {
    id: "review-003",
    reviewerId: "user-customer-001",
    targetUserId: "user-supplier-001",
    overallRating: 4,
    qualityRating: 4,
    communicationRating: 4,
    priceFairnessRating: 4,
    deliveryReliabilityRating: 5,
    title: "Reliable local delivery",
    comment:
      "Materials arrived on the promised day and quantities were correct.",
    status: "PUBLISHED",
    createdAt: "2026-06-12T12:00:00.000Z",
  },
];

export const MOCK_PROVIDER_ANALYTICS: BusinessAnalytics = {
  profileViews: {
    label: "Profile views",
    value: 1248,
    previousValue: 1054,
    percentageChange: 18.4,
    trend: "UP",
  },
  searchAppearances: {
    label: "Search appearances",
    value: 3580,
    previousValue: 3180,
    percentageChange: 12.6,
    trend: "UP",
  },
  contactRequests: {
    label: "Contact requests",
    value: 126,
    previousValue: 108,
    percentageChange: 16.7,
    trend: "UP",
  },
  jobsAccepted: {
    label: "Jobs accepted",
    value: 21,
    previousValue: 18,
    percentageChange: 16.7,
    trend: "UP",
  },
  jobsCompleted: {
    label: "Jobs completed",
    value: 19,
    previousValue: 17,
    percentageChange: 11.8,
    trend: "UP",
  },
  conversionRate: {
    label: "Contact conversion rate",
    value: 16.7,
    previousValue: 15.2,
    percentageChange: 9.9,
    trend: "UP",
  },
  averageRating: {
    label: "Average rating",
    value: 4.8,
    previousValue: 4.7,
    percentageChange: 2.1,
    trend: "UP",
  },
  responseRate: {
    label: "Response rate",
    value: 94,
    previousValue: 91,
    percentageChange: 3.3,
    trend: "UP",
  },
  repeatCustomerRate: {
    label: "Repeat customers",
    value: 38,
    previousValue: 34,
    percentageChange: 11.8,
    trend: "UP",
  },
  activityTrend: [
    {
      date: "2026-07-09",
      value: 31,
    },
    {
      date: "2026-07-10",
      value: 36,
    },
    {
      date: "2026-07-11",
      value: 34,
    },
    {
      date: "2026-07-12",
      value: 42,
    },
    {
      date: "2026-07-13",
      value: 47,
    },
    {
      date: "2026-07-14",
      value: 53,
    },
    {
      date: "2026-07-15",
      value: 61,
    },
  ],
  ratingTrend: [
    {
      date: "2026-02-01",
      value: 4.5,
    },
    {
      date: "2026-03-01",
      value: 4.6,
    },
    {
      date: "2026-04-01",
      value: 4.6,
    },
    {
      date: "2026-05-01",
      value: 4.7,
    },
    {
      date: "2026-06-01",
      value: 4.8,
    },
    {
      date: "2026-07-01",
      value: 4.8,
    },
  ],
  conversionTrend: [
    {
      date: "2026-02-01",
      value: 11,
    },
    {
      date: "2026-03-01",
      value: 12,
    },
    {
      date: "2026-04-01",
      value: 13.5,
    },
    {
      date: "2026-05-01",
      value: 14.2,
    },
    {
      date: "2026-06-01",
      value: 15.4,
    },
    {
      date: "2026-07-01",
      value: 16.7,
    },
  ],
};

export const MOCK_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "membership-customer-plus",
    name: "Customer Plus",
    role: "CUSTOMER",
    description:
      "Membership benefits for customers who frequently hire or purchase through Yartong.",
    monthlyPrice: 199,
    annualPrice: 1990,
    features: [
      "Priority job visibility",
      "Member-only discounts",
      "Verified buyer application",
      "Saved searches",
      "Priority customer support",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "membership-provider-business",
    name: "Provider Business",
    role: "SKILLED_PROVIDER",
    description:
      "Professional tools and advanced analytics for skilled providers.",
    monthlyPrice: 399,
    annualPrice: 3990,
    features: [
      "Advanced business analytics",
      "Expanded portfolio",
      "Priority search visibility",
      "Quotation tools",
      "Advertising discounts",
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "membership-contractor-pro",
    name: "Contractor Pro",
    role: "CONTRACTOR",
    description:
      "Project, team and growth tools for construction contractors.",
    monthlyPrice: 799,
    annualPrice: 7990,
    features: [
      "Advanced analytics",
      "Team management",
      "Project dashboards",
      "Quotation management",
      "Priority contractor placement",
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "membership-supplier-business",
    name: "Supplier Business",
    role: "MATERIAL_SUPPLIER",
    description:
      "Catalogue, inventory and demand-intelligence tools for suppliers.",
    monthlyPrice: 699,
    annualPrice: 6990,
    features: [
      "Advanced demand insights",
      "Expanded product catalogue",
      "Inventory management",
      "Quotation tools",
      "Promoted product discounts",
    ],
    isActive: true,
    sortOrder: 4,
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notification-001",
    userId: "user-provider-001",
    title: "New carpentry request",
    message:
      "A customer has requested a quotation for a custom entrance door.",
    type: "JOB",
    actionUrl: "/worker/job-requests",
    isRead: false,
    createdAt: "2026-07-15T16:10:00.000Z",
  },
  {
    id: "notification-002",
    userId: "user-supplier-001",
    title: "New quotation request",
    message:
      "A customer needs 80 bags of cement delivered to Senapati Town.",
    type: "QUOTATION",
    actionUrl: "/supplier/quotations",
    isRead: false,
    createdAt: "2026-07-15T15:45:00.000Z",
  },
  {
    id: "notification-003",
    userId: "user-contractor-001",
    title: "New message",
    message:
      "A customer has sent additional project measurements.",
    type: "MESSAGE",
    actionUrl: "/messages",
    isRead: true,
    createdAt: "2026-07-15T14:20:00.000Z",
  },
];

/**
 * Lookup helpers for development pages.
 */

export function getMockUserById(
  userId: string,
): User | undefined {
  return MOCK_USERS.find(
    (user) => user.id === userId,
  );
}

export function getMockLocationById(
  locationId: string,
): Location | undefined {
  return MOCK_LOCATIONS.find(
    (location) => location.id === locationId,
  );
}

export function getMockTradeCategoryById(
  categoryId: string,
): TradeCategory | undefined {
  return MOCK_TRADE_CATEGORIES.find(
    (category) => category.id === categoryId,
  );
}

export function getMockMaterialCategoryById(
  categoryId: string,
): MaterialCategory | undefined {
  return MOCK_MATERIAL_CATEGORIES.find(
    (category) => category.id === categoryId,
  );
}

export function getMockMaterialProductById(
  productId: string,
): MaterialProduct | undefined {
  return MOCK_MATERIAL_PRODUCTS.find(
    (product) => product.id === productId,
  );
}

export function getMockProviderProfileById(
  profileId: string,
): SkilledProviderProfile | undefined {
  return MOCK_SKILLED_PROVIDER_PROFILES.find(
    (profile) => profile.id === profileId,
  );
}

export function getMockContractorProfileById(
  profileId: string,
): ContractorProfile | undefined {
  return MOCK_CONTRACTOR_PROFILES.find(
    (profile) => profile.id === profileId,
  );
}

export function getMockSupplierProfileById(
  profileId: string,
): MaterialSupplierProfile | undefined {
  return MOCK_MATERIAL_SUPPLIER_PROFILES.find(
    (profile) => profile.id === profileId,
  );
}

export function getMockJobsForCustomer(
  customerId: string,
): Job[] {
  return MOCK_JOBS.filter(
    (job) => job.customerId === customerId,
  );
}

export function getMockProductsForSupplier(
  supplierId: string,
): MaterialProduct[] {
  return MOCK_MATERIAL_PRODUCTS.filter(
    (product) => product.supplierId === supplierId,
  );
}

export function getMockReviewsForUser(
  userId: string,
): Review[] {
  return MOCK_REVIEWS.filter(
    (review) => review.targetUserId === userId,
  );
}