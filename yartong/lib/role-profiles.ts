import type { UserRole } from "./types";

export const ROLE_PROFILE_RELATION = {
  CUSTOMER: "customerProfile",
  SKILLED_PROVIDER: "skilledProviderProfile",
  LABOURER: "labourerProfile",
  CONTRACTOR: "contractorProfile",
  MATERIAL_SUPPLIER: "materialSupplierProfile",
  ADMIN: null,
} as const satisfies Record<UserRole, string | null>;

export type MarketplaceProfileRelation = Exclude<
  (typeof ROLE_PROFILE_RELATION)[UserRole],
  null
>;

export function getProfileRelationForRole(
  role: UserRole,
): MarketplaceProfileRelation | null {
  return ROLE_PROFILE_RELATION[role];
}

export function roleAllowsProfileRelation(
  role: UserRole,
  relation: MarketplaceProfileRelation,
): boolean {
  return ROLE_PROFILE_RELATION[role] === relation;
}
