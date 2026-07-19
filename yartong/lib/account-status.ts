import { AccountStatus } from "@prisma/client";

export const BLOCKED_ACCOUNT_STATUSES: ReadonlySet<AccountStatus> = new Set([
  AccountStatus.SUSPENDED,
  AccountStatus.REJECTED,
  AccountStatus.DEACTIVATED,
  AccountStatus.BLOCKED,
]);

export function canAccessProtectedFeatures(accountStatus: AccountStatus): boolean {
  return accountStatus === AccountStatus.ACTIVE;
}

export function assertAccountCanAccess(accountStatus: AccountStatus): void {
  if (!canAccessProtectedFeatures(accountStatus)) {
    throw new Error(`Account status ${accountStatus} is not permitted to access protected features.`);
  }
}
