import { redirect } from "next/navigation";

import { auth } from "../auth";
import { hasPermission } from "./permissions";
import { prisma } from "./prisma";
import type { Permission, UserRole } from "./types";

export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      displayName: true,
      email: true,
      image: true,
      primaryRole: true,
      accountStatus: true,
      verificationStatus: true,
      primaryLocationId: true,
      isDemo: true,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.accountStatus !== "ACTIVE") redirect("/login");

  return user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.primaryRole)) redirect("/");

  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();

  if (!hasPermission(user.primaryRole, permission)) redirect("/");

  return user;
}
