import { UserRole } from "@prisma/client";

export type RoleProfileRelation =
  | "customerProfile"
  | "skilledProviderProfile"
  | "labourerProfile"
  | "contractorProfile"
  | "materialSupplierProfile";

export const ROLE_PROFILE_RELATION: Partial<Record<UserRole, RoleProfileRelation>> = {
  [UserRole.CUSTOMER]: "customerProfile",
  [UserRole.SKILLED_PROVIDER]: "skilledProviderProfile",
  [UserRole.LABOURER]: "labourerProfile",
  [UserRole.CONTRACTOR]: "contractorProfile",
  [UserRole.MATERIAL_SUPPLIER]: "materialSupplierProfile",
};

export function getRequiredProfileRelation(primaryRole: UserRole): RoleProfileRelation | null {
  return ROLE_PROFILE_RELATION[primaryRole] ?? null;
}

export function hasMatchingRoleProfile(
  primaryRole: UserRole,
  profiles: Partial<Record<RoleProfileRelation, unknown>>,
): boolean {
  const relation = getRequiredProfileRelation(primaryRole);
  return relation === null || Boolean(profiles[relation]);
}
