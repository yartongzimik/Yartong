import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import type { Permission, UserRole } from "@/lib/types";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return db.user.findUnique({ where: { id: session.user.id }, include: { location: true } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user || user.accountStatus !== "ACTIVE") redirect("/login");
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
