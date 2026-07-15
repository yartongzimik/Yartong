import type { SkillLevel, UserRole } from "./types";

export type SearchCategory =
  | "TRADE"
  | "MATERIAL"
  | "CONTRACTOR"
  | "LABOURER"
  | "SUPPLIER"
  | "QUICK_JOB"
  | "GENERAL";

export type SearchResultType =
  | "SKILLED_PROVIDER"
  | "LABOURER"
  | "CONTRACTOR"
  | "MATERIAL_SUPPLIER"
  | "MATERIAL_PRODUCT"
  | "QUICK_JOB";

export interface SearchFilters {
  locationId?: string;
  pincode?: string;
  tradeCategoryId?: string;
  materialCategoryId?: string;
  skillLevel?: SkillLevel;
  minimumRating?: number;
  availabilityOnly?: boolean;
  verifiedOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface SearchEvent {
  id: string;

  query: string;
  normalizedQuery: string;

  category: SearchCategory;

  location: string;
  pincode?: string;

  locationId?: string;
  userId?: string;
  userRole?: UserRole;
  sessionId?: string;

  filters?: SearchFilters;

  createdAt: string;

  resultsFound: number;
  noResults: boolean;

  clickedResultId?: string;
  clickedResultType?: SearchResultType;
  clickedAt?: string;
}

export interface SearchClickEvent {
  id: string;
  searchEventId: string;

  resultId: string;
  resultType: SearchResultType;
  resultPosition: number;

  userId?: string;
  sessionId?: string;

  createdAt: string;
}

export interface TrendingSearch {
  keyword: string;
  normalizedKeyword: string;

  totalSearches: number;
  uniqueUsers?: number;
  uniqueSessions?: number;

  previousPeriodSearches?: number;
  percentageChange?: number;

  category?: SearchCategory;
}

export interface SearchDemandOpportunity {
  keyword: string;
  category: SearchCategory;

  totalSearches: number;
  noResultSearches: number;

  availableProviders?: number;
  availableProducts?: number;

  opportunityLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

  recommendation:
    | "MONITOR"
    | "RECRUIT_PROVIDERS"
    | "ADD_SUPPLIERS"
    | "EXPAND_INVENTORY"
    | "ADD_CATEGORY"
    | "IMPROVE_LISTINGS";
}

export interface SearchAnalytics {
  totalSearches: number;
  uniqueSearches: number;
  uniqueUsers: number;
  uniqueSessions: number;

  noResultSearches: number;
  noResultRate: number;

  clickThroughRate: number;

  topTrades: TrendingSearch[];
  topMaterials: TrendingSearch[];
  topLocations: TrendingSearch[];
  topQuickJobs: TrendingSearch[];

  demandOpportunities: SearchDemandOpportunity[];
}

export const emptySearchAnalytics: SearchAnalytics = {
  totalSearches: 0,
  uniqueSearches: 0,
  uniqueUsers: 0,
  uniqueSessions: 0,

  noResultSearches: 0,
  noResultRate: 0,

  clickThroughRate: 0,

  topTrades: [],
  topMaterials: [],
  topLocations: [],
  topQuickJobs: [],

  demandOpportunities: [],
};

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function createSearchEvent(input: {
  query: string;
  category: SearchCategory;
  location: string;
  pincode?: string;
  locationId?: string;
  userId?: string;
  userRole?: UserRole;
  sessionId?: string;
  filters?: SearchFilters;
  resultsFound: number;
}): SearchEvent {
  const createdAt = new Date().toISOString();

  return {
    id: crypto.randomUUID(),

    query: input.query.trim(),
    normalizedQuery: normalizeSearchQuery(input.query),

    category: input.category,

    location: input.location,
    pincode: input.pincode,

    locationId: input.locationId,
    userId: input.userId,
    userRole: input.userRole,
    sessionId: input.sessionId,

    filters: input.filters,

    createdAt,

    resultsFound: input.resultsFound,
    noResults: input.resultsFound === 0,
  };
}

export function recordSearchClick(
  searchEvent: SearchEvent,
  result: {
    resultId: string;
    resultType: SearchResultType;
    resultPosition: number;
  },
): SearchClickEvent {
  return {
    id: crypto.randomUUID(),
    searchEventId: searchEvent.id,

    resultId: result.resultId,
    resultType: result.resultType,
    resultPosition: result.resultPosition,

    userId: searchEvent.userId,
    sessionId: searchEvent.sessionId,

    createdAt: new Date().toISOString(),
  };
}

export function calculateNoResultRate(
  totalSearches: number,
  noResultSearches: number,
): number {
  if (totalSearches <= 0) {
    return 0;
  }

  return Number(((noResultSearches / totalSearches) * 100).toFixed(2));
}

export function calculateClickThroughRate(
  totalSearches: number,
  searchesWithClicks: number,
): number {
  if (totalSearches <= 0) {
    return 0;
  }

  return Number(((searchesWithClicks / totalSearches) * 100).toFixed(2));
}

export function determineOpportunityLevel(input: {
  totalSearches: number;
  noResultSearches: number;
  availableListings: number;
}): SearchDemandOpportunity["opportunityLevel"] {
  const noResultRate =
    input.totalSearches > 0
      ? input.noResultSearches / input.totalSearches
      : 0;

  if (
    input.totalSearches >= 50 &&
    noResultRate >= 0.6 &&
    input.availableListings <= 2
  ) {
    return "CRITICAL";
  }

  if (
    input.totalSearches >= 25 &&
    noResultRate >= 0.4 &&
    input.availableListings <= 5
  ) {
    return "HIGH";
  }

  if (
    input.totalSearches >= 10 &&
    noResultRate >= 0.2
  ) {
    return "MODERATE";
  }

  return "LOW";
}