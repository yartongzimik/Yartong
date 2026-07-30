"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isPublicOnboardingRole, type PublicOnboardingRole } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";
import { ensurePhaseTestFixtures, PHASE_TEST_ACCOUNTS } from "@/lib/phase-test-fixtures";
import { prisma } from "@/lib/prisma";

export async function startRegistrationWithoutAuth(role: string) {
  if (!isAuthBypassEnabled) redirect(`/login?role=${encodeURIComponent(role)}`);
  if (!isPublicOnboardingRole(role)) redirect("/login");

  const selectedRole = role as PublicOnboardingRole;
  const account = PHASE_TEST_ACCOUNTS[selectedRole];

  // The rich preview accounts are already seeded in normal preview use. Reuse the
  // selected account immediately instead of rebuilding every profile, activity
  // record and supplier catalogue on every role switch.
  const existingUser = await prisma.user.findUnique({
    where: { email: account.email },
    select: { id: true, primaryRole: true, accountStatus: true },
  });

  const user = existingUser?.primaryRole === selectedRole && existingUser.accountStatus === "ACTIVE"
    ? existingUser
    : await ensurePhaseTestFixtures(selectedRole);

  const cookieStore = await cookies();
  cookieStore.set("yartong_phase_user", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}
