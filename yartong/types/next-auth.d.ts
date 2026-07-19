import type { DefaultSession } from "next-auth";
import type { AccountStatus, UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    primaryRole?: UserRole;
    accountStatus?: AccountStatus;
  }

  interface Session {
    user?: {
      id?: string;
      primaryRole?: UserRole;
      accountStatus?: AccountStatus;
    } & DefaultSession["user"];
  }
}
