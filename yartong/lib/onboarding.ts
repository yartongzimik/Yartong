import { ROUTES } from "./constants";
import type { UserRole } from "./types";

export const PUBLIC_ONBOARDING_ROLES = [
  "CUSTOMER",
  "SKILLED_PROVIDER",
  "LABOURER",
  "CONTRACTOR",
  "MATERIAL_SUPPLIER",
] as const satisfies readonly UserRole[];

export type PublicOnboardingRole = (typeof PUBLIC_ONBOARDING_ROLES)[number];

export const ROLE_LABELS: Record<PublicOnboardingRole, string> = {
  CUSTOMER: "Customer",
  SKILLED_PROVIDER: "Skilled Provider",
  LABOURER: "Labourer",
  CONTRACTOR: "Contractor",
  MATERIAL_SUPPLIER: "Material Supplier",
};

export const ROLE_DESCRIPTIONS: Record<PublicOnboardingRole, string> = {
  CUSTOMER: "Hire trusted local workers, contractors and suppliers for home or business projects.",
  SKILLED_PROVIDER: "Offer a trade or specialist service such as masonry, electrical, plumbing or repair work.",
  LABOURER: "Find site-support and daily work opportunities from customers and contractors.",
  CONTRACTOR: "Manage construction, renovation or service projects for customers and teams.",
  MATERIAL_SUPPLIER: "List your building-material business and receive local material enquiries.",
};

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  CUSTOMER: ROUTES.customerDashboard,
  SKILLED_PROVIDER: ROUTES.skilledProviderDashboard,
  LABOURER: ROUTES.labourerDashboard,
  CONTRACTOR: ROUTES.contractorDashboard,
  MATERIAL_SUPPLIER: ROUTES.supplierDashboard,
  ADMIN: ROUTES.adminDashboard,
  ONBOARDING_PENDING: "/onboarding",
};

export function isPublicOnboardingRole(role: string): role is PublicOnboardingRole {
  return PUBLIC_ONBOARDING_ROLES.includes(role as PublicOnboardingRole);
}

export function getDashboardForRole(role: UserRole) {
  return ROLE_DASHBOARDS[role];
}
