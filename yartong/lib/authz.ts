import { redirect } from "next/navigation";

import { auth } from "../auth";
import { getDashboardForRole } from "./onboarding";
import { hasPermission } from "./permissions";
import { prisma } from "./prisma";
import { getProfileRelationForRole } from "./role-profiles";
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
      customerProfile: { select: { onboardingComplete: true } },
      skilledProviderProfile: { select: { onboardingComplete: true } },
      labourerProfile: { select: { onboardingComplete: true } },
      contractorProfile: { select: { onboardingComplete: true } },
      materialSupplierProfile: { select: { onboardingComplete: true } },
    },
  });
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export function isOnboardingComplete(user: CurrentUser): boolean {
  const relation = getProfileRelationForRole(user.primaryRole);
  if (!relation) return user.primaryRole === "ADMIN";
  return Boolean(user[relation]?.onboardingComplete);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.accountStatus !== "ACTIVE") redirect("/account-blocked");
  if (!isOnboardingComplete(user)) redirect("/onboarding");

  return user;
}

export async function requireOnboardingUser() {
  const user = await getCurrentUser();

  if (!user) redirect("/login?callbackUrl=/onboarding");
  if (user.accountStatus !== "ACTIVE") redirect("/account-blocked");

  return user;
}

export async function redirectAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) return;
  if (user.accountStatus !== "ACTIVE") redirect("/account-blocked");
  if (!isOnboardingComplete(user)) redirect("/onboarding");
  redirect(getDashboardForRole(user.primaryRole));
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.primaryRole)) redirect(getDashboardForRole(user.primaryRole));

  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();

  if (!hasPermission(user.primaryRole, permission)) redirect(getDashboardForRole(user.primaryRole));

  return user;
}
