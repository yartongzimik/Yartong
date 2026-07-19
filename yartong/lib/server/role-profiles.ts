import type { UserRole } from "../types";

export type RoleProfileKind =
  | "customerProfile"
  | "skilledProviderProfile"
  | "labourerProfile"
  | "contractorProfile"
  | "materialSupplierProfile";

export const ROLE_PROFILE_KIND_BY_PRIMARY_ROLE: Readonly<
  Record<Exclude<UserRole, "ADMIN">, RoleProfileKind>
> = {
  CUSTOMER: "customerProfile",
  SKILLED_PROVIDER: "skilledProviderProfile",
  LABOURER: "labourerProfile",
  CONTRACTOR: "contractorProfile",
  MATERIAL_SUPPLIER: "materialSupplierProfile",
};

/**
 * Central invariant for onboarding: create exactly the profile kind mapped from
 * User.primaryRole. Admin users do not receive a role-specific marketplace
 * profile record.
 */
export function getProfileKindForPrimaryRole(
  primaryRole: UserRole,
): RoleProfileKind | null {
  if (primaryRole === "ADMIN") {
    return null;
  }

  return ROLE_PROFILE_KIND_BY_PRIMARY_ROLE[primaryRole];
}

export function assertProfileKindMatchesPrimaryRole(
  primaryRole: UserRole,
  profileKind: RoleProfileKind,
): void {
  const expectedProfileKind = getProfileKindForPrimaryRole(primaryRole);

  if (expectedProfileKind !== profileKind) {
    throw new Error(
      `Cannot create ${profileKind} for primary role ${primaryRole}; expected ${expectedProfileKind ?? "no role profile"}.`,
    );
  }
}
