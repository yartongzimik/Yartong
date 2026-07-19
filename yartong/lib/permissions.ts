import type { Permission, UserRole } from "./types";

/**
 * Permissions available to users who are not logged in.
 *
 * Public users may browse the marketplace, but they cannot post jobs,
 * send messages, save listings, request quotations or manage accounts.
 */
export const PUBLIC_PERMISSIONS: Permission[] = [
  "BROWSE_MARKETPLACE",
];

/**
 * Permanent permission map for every Yartong account role.
 *
 * Keep permission decisions centralized here instead of scattering
 * checks such as `user.role === "CONTRACTOR"` throughout the application.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [
    "BROWSE_MARKETPLACE",
    "POST_JOB",
    "MANAGE_OWN_JOBS",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "SAVE_PROVIDERS",
    "SAVE_PRODUCTS",
    "MANAGE_PROFILE",
  ],

  SKILLED_PROVIDER: [
    "BROWSE_MARKETPLACE",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "MANAGE_PROFILE",
    "MANAGE_PORTFOLIO",
    "RECEIVE_JOB_REQUESTS",
    "ACCEPT_JOBS",
    "MANAGE_AVAILABILITY",
    "CREATE_QUOTATIONS",
    "VIEW_BASIC_ANALYTICS",
    "VIEW_ADVANCED_ANALYTICS",
    "ADVERTISE",
  ],

  LABOURER: [
    "BROWSE_MARKETPLACE",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "MANAGE_PROFILE",
    "RECEIVE_JOB_REQUESTS",
    "ACCEPT_JOBS",
    "MANAGE_AVAILABILITY",
    "VIEW_BASIC_ANALYTICS",
  ],

  CONTRACTOR: [
    "BROWSE_MARKETPLACE",
    "POST_JOB",
    "MANAGE_OWN_JOBS",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "SAVE_PROVIDERS",
    "SAVE_PRODUCTS",
    "MANAGE_PROFILE",
    "MANAGE_PORTFOLIO",
    "RECEIVE_JOB_REQUESTS",
    "ACCEPT_JOBS",
    "MANAGE_AVAILABILITY",
    "VIEW_BASIC_ANALYTICS",
    "VIEW_ADVANCED_ANALYTICS",
    "MANAGE_TEAM",
    "MANAGE_PROJECTS",
    "CREATE_QUOTATIONS",
    "ADVERTISE",
  ],

  MATERIAL_SUPPLIER: [
    "BROWSE_MARKETPLACE",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "SAVE_PROVIDERS",
    "MANAGE_PROFILE",
    "MANAGE_PORTFOLIO",
    "VIEW_BASIC_ANALYTICS",
    "VIEW_ADVANCED_ANALYTICS",
    "CREATE_QUOTATIONS",
    "MANAGE_PRODUCTS",
    "MANAGE_INVENTORY",
    "RECEIVE_MATERIAL_ENQUIRIES",
    "ADVERTISE",
  ],

  ONBOARDING_PENDING: [
    "BROWSE_MARKETPLACE",
  ],

  ADMIN: [
    "BROWSE_MARKETPLACE",
    "POST_JOB",
    "MANAGE_OWN_JOBS",
    "SEND_MESSAGES",
    "SHARE_CONTACT_DETAILS",
    "SAVE_PROVIDERS",
    "SAVE_PRODUCTS",
    "MANAGE_PROFILE",
    "MANAGE_PORTFOLIO",
    "RECEIVE_JOB_REQUESTS",
    "ACCEPT_JOBS",
    "MANAGE_AVAILABILITY",
    "VIEW_BASIC_ANALYTICS",
    "VIEW_ADVANCED_ANALYTICS",
    "MANAGE_TEAM",
    "MANAGE_PROJECTS",
    "CREATE_QUOTATIONS",
    "MANAGE_PRODUCTS",
    "MANAGE_INVENTORY",
    "RECEIVE_MATERIAL_ENQUIRIES",
    "ADVERTISE",
    "MANAGE_USERS",
    "MANAGE_CATEGORIES",
    "MANAGE_VERIFICATIONS",
    "VIEW_PLATFORM_ANALYTICS",
    "MANAGE_MEMBERSHIPS",
    "MANAGE_ADVERTISEMENTS",
  ],
};

/**
 * Returns all permissions granted to a specific account role.
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Checks whether a role has one specific permission.
 */
export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Checks whether a role has every permission in the supplied list.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) =>
    ROLE_PERMISSIONS[role].includes(permission),
  );
}

/**
 * Checks whether a role has at least one permission in the supplied list.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) =>
    ROLE_PERMISSIONS[role].includes(permission),
  );
}

/**
 * Checks a permission for either a signed-in role or a public visitor.
 */
export function canAccess(
  role: UserRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) {
    return PUBLIC_PERMISSIONS.includes(permission);
  }

  return hasPermission(role, permission);
}

/**
 * Returns true for professional or business-oriented account types.
 */
export function isBusinessRole(role: UserRole): boolean {
  return [
    "SKILLED_PROVIDER",
    "CONTRACTOR",
    "MATERIAL_SUPPLIER",
  ].includes(role);
}

/**
 * Returns true for roles that can receive work opportunities.
 */
export function canReceiveWork(role: UserRole): boolean {
  return [
    "SKILLED_PROVIDER",
    "LABOURER",
    "CONTRACTOR",
  ].includes(role);
}

/**
 * Returns true for roles that receive business analytics.
 */
export function hasBusinessAnalytics(role: UserRole): boolean {
  return [
    "SKILLED_PROVIDER",
    "LABOURER",
    "CONTRACTOR",
    "MATERIAL_SUPPLIER",
    "ADMIN",
  ].includes(role);
}

/**
 * Returns true for roles that require Yartong or admin approval
 * before their public profile becomes active.
 */
export function requiresAdminApproval(role: UserRole): boolean {
  return [
    "SKILLED_PROVIDER",
    "LABOURER",
    "CONTRACTOR",
    "MATERIAL_SUPPLIER",
  ].includes(role);
}

/**
 * Returns true for roles eligible to advertise on Yartong.
 */
export function canAdvertise(role: UserRole): boolean {
  return hasPermission(role, "ADVERTISE");
}

/**
 * Returns true for roles allowed to create quotations.
 */
export function canCreateQuotations(role: UserRole): boolean {
  return hasPermission(role, "CREATE_QUOTATIONS");
}

/**
 * Returns true for roles allowed to share contact details
 * inside an existing Yartong conversation.
 */
export function canShareContactDetails(role: UserRole): boolean {
  return hasPermission(role, "SHARE_CONTACT_DETAILS");
}