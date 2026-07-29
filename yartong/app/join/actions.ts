"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAuthBypassEnabled } from "@/lib/phase-flags";
import { isPublicOnboardingRole } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

export async function startRegistrationWithoutAuth(role: string) {
  if (!isAuthBypassEnabled) redirect(`/login?callbackUrl=${encodeURIComponent(`/onboarding?role=${role}`)}`);
  if (!isPublicOnboardingRole(role)) redirect("/join");

  const user = await prisma.user.create({
    data: {
      accountStatus: "ACTIVE",
      primaryRole: "ONBOARDING_PENDING",
      displayName: "",
      isDemo: false,
    },
    select: { id: true },
  });

  const cookieStore = await cookies();
  cookieStore.set("yartong_phase_user", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(`/onboarding?role=${role}`);
}
