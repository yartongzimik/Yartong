import type { AccountStatus } from "./types";

export const BLOCKED_ACCOUNT_STATUSES: readonly AccountStatus[] = [
  "SUSPENDED",
  "REJECTED",
  "DEACTIVATED",
];

export function canAccessProtectedRoutes(status: AccountStatus): boolean {
  return !BLOCKED_ACCOUNT_STATUSES.includes(status);
}
