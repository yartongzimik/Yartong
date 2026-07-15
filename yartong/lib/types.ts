// lib/types.ts

export type UserRole =
  | "CUSTOMER"
  | "SKILLED_PROVIDER"
  | "LABOURER"
  | "CONTRACTOR"
  | "MATERIAL_SUPPLIER"
  | "ADMIN";

export type AccountStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "REJECTED"
  | "DEACTIVATED";

export type VerificationStatus =
  | "UNVERIFIED"
  | "PHONE_VERIFIED"
  | "IDENTITY_VERIFIED"
  | "BUSINESS_VERIFIED"
  | "YARTONG_VERIFIED";

export type SkillLevel =
  | "LEVEL_1_ASSISTANT"
  | "LEVEL_2_SKILLED"
  | "LEVEL_3_PROFESSIONAL"
  | "LEVEL_4_SPECIALIST";

export type AvailabilityStatus =
  | "AVAILABLE"
  | "LIMITED"
  | "BUSY"
  | "UNAVAILABLE";

export type PricingMethod =
  | "HOURLY"
  | "DAILY"
  | "STARTING_PRICE"
  | "FIXED_PROJECT"
  | "QUOTE_REQUIRED"
  | "CONTRACT_RATE";

export type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "MATCHING"
  | "REQUESTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "DISPUTED";

export type JobUrgency =
  | "STANDARD"
  | "WITHIN_24_HOURS"
  | "EMERGENCY";

export type PaymentType =
  | "HOURLY"
  | "DAILY_WAGE"
  | "FIXED_PRICE"
  | "PROJECT_QUOTE"
  | "CONTRACT";

export type ConversationStatus =
  | "OPEN"
  | "WAITING_FOR_CUSTOMER"
  | "WAITING_FOR_PROVIDER"
  | "CLOSED"
  | "ARCHIVED";

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "FILE"
  | "SYSTEM"
  | "CONTACT_DETAILS"
  | "JOB_REQUEST"
  | "QUOTATION";

export type MaterialStockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "AVAILABLE_ON_ORDER"
  | "TEMPORARILY_UNAVAILABLE";

export type MaterialPriceType =
  | "FIXED"
  | "STARTING_FROM"
  | "PRICE_RANGE"
  | "QUOTE_REQUIRED"
  | "WHOLESALE_QUOTE";

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "NEGOTIATING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "ORDER_CONFIRMED"
  | "COMPLETED";

export type ReviewStatus =
  | "PENDING"
  | "PUBLISHED"
  | "HIDDEN"
  | "REPORTED";

  export type Permission =
  | "BROWSE_MARKETPLACE"
  | "POST_JOB"
  | "MANAGE_OWN_JOBS"
  | "SEND_MESSAGES"
  | "SHARE_CONTACT_DETAILS"
  | "SAVE_PROVIDERS"
  | "SAVE_PRODUCTS"
  | "MANAGE_PROFILE"
  | "MANAGE_PORTFOLIO"
  | "RECEIVE_JOB_REQUESTS"
  | "ACCEPT_JOBS"
  | "MANAGE_AVAILABILITY"
  | "VIEW_BASIC_ANALYTICS"
  | "VIEW_ADVANCED_ANALYTICS"
  | "MANAGE_TEAM"
  | "MANAGE_PROJECTS"
  | "CREATE_QUOTATIONS"
  | "MANAGE_PRODUCTS"
  | "MANAGE_INVENTORY"
  | "RECEIVE_MATERIAL_ENQUIRIES"
  | "ADVERTISE"
  | "MANAGE_USERS"
  | "MANAGE_CATEGORIES"
  | "MANAGE_VERIFICATIONS"
  | "VIEW_PLATFORM_ANALYTICS"
  | "MANAGE_MEMBERSHIPS"
  | "MANAGE_ADVERTISEMENTS";

export interface RoleDefinition {
  id: UserRole;
  displayName: string;
  description: string;
  dashboardPath: string;
  permissions: Permission[];
  analyticsAccess: "NONE" | "BASIC" | "ADVANCED" | "PLATFORM";
  membershipEligible: boolean;
  requiresAdminApproval: boolean;
}

export interface Location {
  id: string;
  name: string;
  district: string;
  state: string;
  country: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface User {
  id: string;
  role: UserRole;

  displayName: string;
  email?: string;
  phoneNumber: string;
  profileImageUrl?: string;

  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;

  location?: Location;

  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;

  isVerifiedBuyer: boolean;
  membershipPlanId?: string;

  savedProviderIds: string[];
  savedSupplierIds: string[];
  savedMaterialIds: string[];

  jobsPosted: number;
  completedJobs: number;
  reviewsGiven: number;
}

export interface TradeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;

  isActive: boolean;
  sortOrder: number;

  parentCategoryId?: string;
}

export interface ProviderService {
  id: string;
  providerId: string;
  tradeCategoryId: string;

  name: string;
  description?: string;

  skillLevel: SkillLevel;
  yearsOfExperience?: number;

  pricingMethods: PricingMethod[];

  hourlyRate?: number;
  dailyRate?: number;
  startingPrice?: number;

  isPrimaryService: boolean;
  isActive: boolean;
}

export interface SkilledProviderProfile {
  id: string;
  userId: string;
yartongBusinessId: string;
businessHealthScore: number;
  businessName?: string;
  headline: string;
  biography: string;

  availabilityStatus: AvailabilityStatus;
  serviceLocationIds: string[];

  services: ProviderService[];

  trustScore: number;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;

  profileViews: number;
  searchAppearances: number;
  contactRequests: number;

  averageResponseMinutes?: number;
  acceptanceRate: number;
  completionRate: number;
  repeatCustomerRate: number;

  portfolioItems: PortfolioItem[];
}

export interface LabourerProfile {
  id: string;
  userId: string;
businessHealthScore: number;
  workCategories: string[];

  availabilityStatus: AvailabilityStatus;
  employmentPreference:
    | "FULL_TIME"
    | "PART_TIME"
    | "DAILY_WAGE"
    | "MULTI_DAY"
    | "CONTRACT"
    | "FLEXIBLE";

  expectedDailyWage?: number;
  acceptsContractWork: boolean;

  attendanceScore: number;
  punctualityScore: number;
  reliabilityScore: number;

  averageRating: number;
  completedJobs: number;
  daysWorked: number;
  rehireRate: number;

  managedByYartong: boolean;
}

export interface ContractorProfile {
  id: string;
  userId: string;
yartongBusinessId: string;
businessHealthScore: number;
  businessName: string;
  headline: string;
  description: string;

  teamSize: number;
  yearsInBusiness?: number;

  tradeCategoryIds: string[];
  serviceLocationIds: string[];

  minimumProjectValue?: number;
  maximumProjectValue?: number;

  availabilityStatus: AvailabilityStatus;

  completedProjects: number;
  activeProjects: number;

  averageRating: number;
  trustScore: number;

  profileViews: number;
  quotationRequests: number;
  conversionRate: number;

  portfolioItems: PortfolioItem[];
}

export interface MaterialSupplierProfile {
  id: string;
  userId: string;
yartongBusinessId: string;
businessHealthScore: number;
  businessName: string;
  description: string;

  businessType:
    | "RETAILER"
    | "WHOLESALER"
    | "DISTRIBUTOR"
    | "MANUFACTURER"
    | "INDIVIDUAL_SELLER";

  serviceLocationIds: string[];

  offersRetail: boolean;
  offersWholesale: boolean;
  offersDelivery: boolean;

  minimumOrderValue?: number;

  productCount: number;
  profileViews: number;
  productViews: number;

  quotationRequests: number;
  acceptedQuotations: number;
  completedOrders: number;

  averageRating: number;
  responseRate: number;
  conversionRate: number;
  repeatCustomerRate: number;

  businessGrowthScore: number;
}

export interface PortfolioItem {
  id: string;
  ownerId: string;

  title: string;
  description?: string;

  imageUrls: string[];

  tradeCategoryId?: string;
  locationName?: string;

  completedAt?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  customerId: string;

  title: string;
  description: string;

  tradeCategoryId: string;
  requiredSkillLevel?: SkillLevel;

  locationId: string;
  pincode?: string;

  preferredDate?: string;
  urgency: JobUrgency;

  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;

  paymentType: PaymentType;

  numberOfWorkers: number;
  expectedDuration?: string;

  imageUrls: string[];

  status: JobStatus;

  assignedProviderId?: string;
  assignedLabourerIds?: string[];
  assignedContractorId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface QuickJob extends Job {
  isQuickJob: true;
  expectedDuration:
    | "UNDER_2_HOURS"
    | "HALF_DAY"
    | "FULL_DAY"
    | "MULTI_DAY";
}

export interface Conversation {
  id: string;

  participantIds: string[];

  jobId?: string;
  materialId?: string;
  quotationId?: string;

  status: ConversationStatus;

  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;

  type: MessageType;
  content: string;

  attachmentUrls?: string[];

  isRead: boolean;
  readAt?: string;

  createdAt: string;
}

export interface SharedContactDetails {
  phoneNumber?: string;
  email?: string;
  whatsappNumber?: string;

  sharedByUserId: string;
  sharedAt: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;

  parentCategoryId?: string;

  isActive: boolean;
  sortOrder: number;
}

export interface MaterialProduct {
  id: string;
  supplierId: string;
  categoryId: string;

  name: string;
  slug: string;
  brand?: string;
  description: string;

  imageUrls: string[];

  unit:
    | "BAG"
    | "KILOGRAM"
    | "TONNE"
    | "PIECE"
    | "BUNDLE"
    | "FOOT"
    | "SQUARE_FOOT"
    | "CUBIC_FOOT"
    | "LITRE"
    | "TRUCKLOAD";

  priceType: MaterialPriceType;

  retailPrice?: number;
  wholesalePrice?: number;
  minimumOrderQuantity?: number;

  stockStatus: MaterialStockStatus;
  availableQuantity?: number;

  deliveryAvailable: boolean;
  deliveryCharge?: number;

  serviceLocationIds: string[];

  lastPriceUpdatedAt?: string;
  expectedRestockAt?: string;

  isActive: boolean;
  isFeatured: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;

  requesterId: string;
  providerId?: string;
  contractorId?: string;
  supplierId?: string;

  jobId?: string;
  materialProductId?: string;

  status: QuotationStatus;

  subtotal?: number;
  deliveryFee?: number;
  totalAmount?: number;

  validUntil?: string;
  paymentTerms?: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;

  reviewerId: string;
  targetUserId: string;

  jobId?: string;
  orderId?: string;

  overallRating: number;

  qualityRating?: number;
  punctualityRating?: number;
  communicationRating?: number;
  priceFairnessRating?: number;
  deliveryReliabilityRating?: number;

  title?: string;
  comment?: string;

  status: ReviewStatus;

  createdAt: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  previousValue?: number;
  percentageChange?: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface BusinessAnalytics {
  profileViews: AnalyticsMetric;
  searchAppearances: AnalyticsMetric;
  contactRequests: AnalyticsMetric;

  jobsAccepted?: AnalyticsMetric;
  jobsCompleted?: AnalyticsMetric;

  quotationRequests?: AnalyticsMetric;
  acceptedQuotations?: AnalyticsMetric;

  conversionRate: AnalyticsMetric;
  averageRating: AnalyticsMetric;
  responseRate: AnalyticsMetric;
  repeatCustomerRate: AnalyticsMetric;

  activityTrend: TimeSeriesPoint[];
  ratingTrend: TimeSeriesPoint[];
  conversionTrend: TimeSeriesPoint[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  role: UserRole;

  description: string;
  monthlyPrice: number;
  annualPrice?: number;

  features: string[];

  isActive: boolean;
  sortOrder: number;
}

export interface Advertisement {
  id: string;
  advertiserId: string;

  title: string;
  description?: string;
  imageUrl?: string;

  placement:
    | "HOMEPAGE"
    | "TRADE_CATEGORY"
    | "MATERIAL_CATEGORY"
    | "SEARCH_RESULTS"
    | "FEATURED_PROVIDER"
    | "FEATURED_PRODUCT";

  targetLocationIds: string[];

  startDate: string;
  endDate: string;

  impressions: number;
  clicks: number;

  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;

  title: string;
  message: string;

  type:
    | "JOB"
    | "MESSAGE"
    | "QUOTATION"
    | "REVIEW"
    | "VERIFICATION"
    | "MEMBERSHIP"
    | "SYSTEM";

  actionUrl?: string;

  isRead: boolean;
  createdAt: string;
}