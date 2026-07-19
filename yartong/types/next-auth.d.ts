import type { AccountStatus, UserRole } from "../lib/types";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      primaryRole: UserRole;
      accountStatus: AccountStatus;
    } & DefaultSession["user"];
  }

  interface User {
    primaryRole: UserRole;
    accountStatus: AccountStatus;
  }
}
