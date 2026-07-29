"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardForRole, isPublicOnboardingRole, type PublicOnboardingRole } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";
import { ensurePhaseTestingFixtures } from "@/lib/phase-test-fixtures";

export async function startRegistrationWithoutAuth(role: string) {
  if (!isAuthBypassEnabled) redirect(`/login?callbackUrl=${encodeURIComponent(`/onboarding?role=${role}`)}`);
  if (!isPublicOnboardingRole(role)) redirect("/join");

  const selectedRole = role as PublicOnboardingRole;
  const users = await ensurePhaseTestingFixtures();
  const user = users[selectedRole];

  const cookieStore = await cookies();
  cookieStore.set("yartong_phase_user", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(getDashboardForRole(selectedRole));
}
