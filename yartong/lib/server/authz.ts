import { canAccessProtectedRoutes } from "../account-status";
import { hasPermission } from "../permissions";
import type { AccountStatus, Permission, UserRole } from "../types";

export interface PersistedUserAuthorization {
  id: string;
  primaryRole: UserRole;
  accountStatus: AccountStatus;
}

export function assertAuthorizedAccount(
  user: PersistedUserAuthorization | null | undefined,
): PersistedUserAuthorization {
  if (!user || !canAccessProtectedRoutes(user.accountStatus)) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function requireRole(
  user: PersistedUserAuthorization | null | undefined,
  allowedRoles: readonly UserRole[],
): PersistedUserAuthorization {
  const authorizedUser = assertAuthorizedAccount(user);

  if (!allowedRoles.includes(authorizedUser.primaryRole)) {
    throw new Error("Forbidden");
  }

  return authorizedUser;
}

export function requirePermission(
  user: PersistedUserAuthorization | null | undefined,
  permission: Permission,
): PersistedUserAuthorization {
  const authorizedUser = assertAuthorizedAccount(user);

  if (!hasPermission(authorizedUser.primaryRole, permission)) {
    throw new Error("Forbidden");
  }

  return authorizedUser;
}
