import type { AccountStatus, UserRole } from "./lib/types";

declare module "next-auth" {
  interface User {
    id: string;
    primaryRole: UserRole;
    accountStatus: AccountStatus;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    primaryRole: UserRole;
    accountStatus: AccountStatus;
  }
}
