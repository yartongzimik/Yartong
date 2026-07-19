/**
 * Global Yartong platform configuration.
 *
 * Keep stable branding, route paths, limits and default marketplace
 * settings here instead of repeating them across components and pages.
 */

export const PLATFORM = {
  name: "Yartong",
  domain: "yartong.com",
  description:
    "A local marketplace connecting customers with workers, contractors, labourers and construction-material suppliers.",
  supportEmail: "support@yartong.com",
  defaultCountry: "India",
  defaultState: "Manipur",
  defaultDistrict: "Senapati",
  defaultCurrency: "INR",
  currencySymbol: "₹",
  defaultLocale: "en-IN",
  defaultTimeZone: "Asia/Kolkata",
} as const;

export const BRAND = {
  textLogo: "Yartong",

  theme: {
    background: "#07050D",
    surface: "#100A1B",
    surfaceElevated: "#171023",
    border: "rgba(203, 169, 255, 0.15)",

    primary: "#9B4DFF",
    secondary: "#E126FF",
    success: "#68F5A4",
    warning: "#F59E0B",
    danger: "#FF668A",

    textPrimary: "#F8F6FF",
    textSecondary: "#AAA3B8",
  },
} as const;

export const ROUTES = {
  home: "/",

  workers: "/workers",
  workerProfile: "/providers",
  providerProfile: "/providers",

  trades: "/trades",

  quickJobs: "/quick-jobs",
  jobs: "/jobs",
  postJob: "/post-job",

  materials: "/materials",
  materialProfile: "/materials",

  messages: "/messages",

  login: "/login",
  register: "/register",
  join: "/join",

  advertise: "/advertise",

  customerDashboard: "/customer/dashboard",
  customerJobs: "/customer/jobs",
  customerMessages: "/customer/messages",
  customerMembership: "/customer/membership",

  skilledProviderDashboard: "/worker/dashboard",
  skilledProviderProfile: "/worker/profile",

  labourerDashboard: "/labourer/dashboard",
  labourerProfile: "/labourer/profile",

  contractorDashboard: "/contractor/dashboard",
  contractorProfile: "/contractor/profile",

  supplierDashboard: "/supplier/dashboard",
  supplierProfile: "/supplier/profile",
  supplierProducts: "/supplier/products",
  supplierInventory: "/supplier/inventory",

  adminDashboard: "/admin",
  adminUsers: "/admin/users",
  adminCategories: "/admin/categories",
  adminAnalytics: "/admin/analytics",
} as const;

export const INITIAL_SERVICE_LOCATIONS = [
  {
    id: "senapati",
    name: "Senapati",
    district: "Senapati",
    state: "Manipur",
    country: "India",
    isActive: true,
  },
] as const;

export const LOCATION_CONFIG = {
  defaultLocationId: "senapati",

  allowLocationSelection: true,
  allowPincodeSearch: true,

  futureExpansionEnabled: true,

  defaultSearchRadiusKm: 25,
  maximumSearchRadiusKm: 100,
} as const;

export const BUSINESS_ID_CONFIG = {
  prefix: "YB",
  separator: "-",
  minimumDigits: 6,

  example: "YB-000001",

  eligibleRoles: [
    "SKILLED_PROVIDER",
    "CONTRACTOR",
    "MATERIAL_SUPPLIER",
  ],
} as const;

export const SKILL_LEVEL_LABELS = {
  LEVEL_1_ASSISTANT: {
    label: "Foundation",
    shortLabel: "F1",
  },

  LEVEL_2_SKILLED: {
    label: "Professional",
    shortLabel: "P2",
  },

  LEVEL_3_PROFESSIONAL: {
    label: "Specialist",
    shortLabel: "S3",
  },

  LEVEL_4_SPECIALIST: {
    label: "Master",
    shortLabel: "M4",
  },
} as const;

export const PRICING_METHOD_LABELS = {
  HOURLY: "Hourly rate",
  DAILY: "Daily rate",
  STARTING_PRICE: "Starting price",
  FIXED_PROJECT: "Fixed project price",
  QUOTE_REQUIRED: "Quote required",
  CONTRACT_RATE: "Contract rate",
} as const;

export const AVAILABILITY_LABELS = {
  AVAILABLE: "Available",
  LIMITED: "Limited availability",
  BUSY: "Currently busy",
  UNAVAILABLE: "Unavailable",
} as const;

export const VERIFICATION_LABELS = {
  UNVERIFIED: "Unverified",
  PHONE_VERIFIED: "Phone verified",
  IDENTITY_VERIFIED: "Identity verified",
  BUSINESS_VERIFIED: "Business verified",
  YARTONG_VERIFIED: "Yartong verified",
} as const;

export const ACCOUNT_STATUS_LABELS = {
  PENDING: "Pending approval",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
  DEACTIVATED: "Deactivated",
} as const;

export const JOB_STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
} as const;

export const JOB_BUDGET_TYPE_LABELS = {
  FIXED: "Fixed budget",
  RANGE: "Budget range",
  NEGOTIABLE: "Negotiable",
} as const;

export const JOB_PROVIDER_ROLE_LABELS = {
  SKILLED_PROVIDER: "Skilled provider",
  LABOURER: "Labourer",
  CONTRACTOR: "Contractor",
} as const;

export const JOB_URGENCY_LABELS = {
  STANDARD: "Standard",
  WITHIN_24_HOURS: "Within 24 hours",
  EMERGENCY: "Emergency",
} as const;

export const MATERIAL_STOCK_LABELS = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
  AVAILABLE_ON_ORDER: "Available on order",
  TEMPORARILY_UNAVAILABLE: "Temporarily unavailable",
} as const;

export const MATERIAL_PRICE_LABELS = {
  FIXED: "Fixed price",
  STARTING_FROM: "Starting from",
  PRICE_RANGE: "Price range",
  QUOTE_REQUIRED: "Quote required",
  WHOLESALE_QUOTE: "Wholesale quotation",
} as const;

export const MATERIAL_UNITS = [
  {
    id: "BAG",
    label: "Bag",
  },
  {
    id: "KILOGRAM",
    label: "Kilogram",
  },
  {
    id: "TONNE",
    label: "Tonne",
  },
  {
    id: "PIECE",
    label: "Piece",
  },
  {
    id: "BUNDLE",
    label: "Bundle",
  },
  {
    id: "FOOT",
    label: "Foot",
  },
  {
    id: "SQUARE_FOOT",
    label: "Square foot",
  },
  {
    id: "CUBIC_FOOT",
    label: "Cubic foot",
  },
  {
    id: "LITRE",
    label: "Litre",
  },
  {
    id: "TRUCKLOAD",
    label: "Truckload",
  },
] as const;

export const QUICK_JOB_DURATIONS = [
  {
    id: "UNDER_2_HOURS",
    label: "Under 2 hours",
  },
  {
    id: "HALF_DAY",
    label: "Half day",
  },
  {
    id: "FULL_DAY",
    label: "Full day",
  },
  {
    id: "MULTI_DAY",
    label: "Multiple days",
  },
] as const;

export const ANALYTICS_DATE_RANGES = [
  {
    id: "7_DAYS",
    label: "7 days",
    days: 7,
  },
  {
    id: "30_DAYS",
    label: "30 days",
    days: 30,
  },
  {
    id: "3_MONTHS",
    label: "3 months",
    days: 90,
  },
  {
    id: "6_MONTHS",
    label: "6 months",
    days: 180,
  },
  {
    id: "1_YEAR",
    label: "1 year",
    days: 365,
  },
  {
    id: "CUSTOM",
    label: "Custom range",
    days: null,
  },
] as const;

export const TRUST_SCORE = {
  minimum: 0,
  maximum: 100,

  labels: {
    excellent: {
      minimum: 90,
      label: "Excellent",
    },

    strong: {
      minimum: 75,
      label: "Strong",
    },

    developing: {
      minimum: 55,
      label: "Developing",
    },

    needsImprovement: {
      minimum: 0,
      label: "Needs improvement",
    },
  },

  weights: {
    customerRating: 25,
    completionRate: 20,
    responseTime: 10,
    repeatCustomers: 10,
    verification: 10,
    platformActivity: 10,
    profileCompleteness: 5,
    onTimeCompletion: 10,
  },
} as const;

export const BUSINESS_HEALTH_SCORE = {
  minimum: 0,
  maximum: 100,

  weights: {
    customerGrowth: 20,
    responseRate: 15,
    ratings: 15,
    portfolioQuality: 10,
    quotationConversion: 15,
    repeatCustomers: 15,
    profileActivity: 10,
  },

  labels: {
    excellent: {
      minimum: 85,
      label: "Excellent",
    },

    growing: {
      minimum: 70,
      label: "Growing",
    },

    stable: {
      minimum: 50,
      label: "Stable",
    },

    attentionNeeded: {
      minimum: 0,
      label: "Attention needed",
    },
  },
} as const;

export const PAGINATION = {
  defaultPage: 1,

  workersPerPage: 12,
  materialsPerPage: 12,
  quickJobsPerPage: 15,
  conversationsPerPage: 20,
  messagesPerPage: 50,
  adminRecordsPerPage: 25,

  maximumPageSize: 100,
} as const;

export const FILE_UPLOAD_LIMITS = {
  profileImage: {
    maximumFiles: 1,
    maximumSizeMb: 5,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  portfolioImages: {
    maximumFiles: 20,
    maximumSizeMb: 8,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  jobImages: {
    maximumFiles: 10,
    maximumSizeMb: 8,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  productImages: {
    maximumFiles: 12,
    maximumSizeMb: 8,
    acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  documents: {
    maximumFiles: 10,
    maximumSizeMb: 15,
    acceptedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  },
} as const;

export const PLATFORM_LIMITS = {
  minimumPasswordLength: 8,

  maximumJobTitleLength: 120,
  maximumJobDescriptionLength: 5_000,

  maximumProfileHeadlineLength: 120,
  maximumProfileBiographyLength: 5_000,

  maximumMessageLength: 4_000,

  maximumPortfolioTitleLength: 120,
  maximumPortfolioDescriptionLength: 2_000,

  maximumProductNameLength: 160,
  maximumProductDescriptionLength: 5_000,

  maximumReviewTitleLength: 120,
  maximumReviewCommentLength: 3_000,
} as const;

export const SEARCH_CONFIG = {
  minimumQueryLength: 2,
  maximumQueryLength: 120,

  recentSearchLimit: 10,
  suggestedSearchLimit: 8,

  trackAnonymousSearches: true,
  trackNoResultSearches: true,
  trackResultClicks: true,

  defaultLocation: "Senapati",
} as const;

export const CONTACT_SHARING_CONFIG = {
  publicContactDetailsVisible: false,

  contactSharingRequiresConversation: true,

  allowedContactMethods: [
    "PHONE",
    "WHATSAPP",
    "EMAIL",
  ],

  defaultOpeningMessage:
    "Hello, I found your profile on Yartong and would like to discuss a job or enquiry with you.",
} as const;

export const VERIFICATION_REQUIREMENTS = {
  CUSTOMER: [
    "PHONE_NUMBER",
  ],

  SKILLED_PROVIDER: [
    "PHONE_NUMBER",
    "GOVERNMENT_ID",
    "PROFILE_PHOTO",
    "LOCALITY",
    "TRADE_EXPERIENCE",
    "PORTFOLIO",
  ],

  LABOURER: [
    "PHONE_NUMBER",
    "GOVERNMENT_ID",
    "PROFILE_PHOTO",
    "LOCALITY",
    "EMERGENCY_CONTACT",
    "WORK_CATEGORIES",
  ],

  CONTRACTOR: [
    "PHONE_NUMBER",
    "GOVERNMENT_ID",
    "PROFILE_PHOTO",
    "BUSINESS_NAME",
    "BUSINESS_ADDRESS",
    "PROJECT_PORTFOLIO",
    "TEAM_INFORMATION",
  ],

  MATERIAL_SUPPLIER: [
    "PHONE_NUMBER",
    "GOVERNMENT_ID",
    "BUSINESS_NAME",
    "BUSINESS_ADDRESS",
    "SHOP_OR_WAREHOUSE_PHOTOS",
    "PRODUCT_CATALOGUE",
  ],

  ADMIN: [],
} as const;