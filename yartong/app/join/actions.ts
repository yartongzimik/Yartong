"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardForRole, isPublicOnboardingRole, type PublicOnboardingRole } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";
import { prisma } from "@/lib/prisma";

const TEST_ACCOUNT_CONFIG: Record<PublicOnboardingRole, { email: string; displayName: string; headline?: string }> = {
  CUSTOMER: { email: "testing.customer@phase.yartong.local", displayName: "Test Customer" },
  SKILLED_PROVIDER: { email: "testing.provider@phase.yartong.local", displayName: "Test Skilled Provider", headline: "Local skilled service provider" },
  LABOURER: { email: "testing.labourer@phase.yartong.local", displayName: "Test Labourer", headline: "Available for local work" },
  CONTRACTOR: { email: "testing.contractor@phase.yartong.local", displayName: "Test Contractor", headline: "Local construction and project contractor" },
  MATERIAL_SUPPLIER: { email: "testing.supplier@phase.yartong.local", displayName: "Test Material Supplier", headline: "Local construction material supplier" },
};

export async function startRegistrationWithoutAuth(role: string) {
  if (!isAuthBypassEnabled) redirect(`/login?callbackUrl=${encodeURIComponent(`/onboarding?role=${role}`)}`);
  if (!isPublicOnboardingRole(role)) redirect("/join");

  const selectedRole = role as PublicOnboardingRole;
  const config = TEST_ACCOUNT_CONFIG[selectedRole];
  const primaryLocation = await prisma.location.findFirst({
    where: { isActive: true },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  const user = await prisma.user.upsert({
    where: { email: config.email },
    update: {
      displayName: config.displayName,
      name: config.displayName,
      primaryRole: selectedRole,
      accountStatus: "ACTIVE",
      primaryLocationId: primaryLocation?.id ?? null,
      isDemo: false,
    },
    create: {
      email: config.email,
      displayName: config.displayName,
      name: config.displayName,
      primaryRole: selectedRole,
      accountStatus: "ACTIVE",
      primaryLocationId: primaryLocation?.id ?? null,
      isDemo: false,
    },
    select: { id: true },
  });

  if (selectedRole === "CUSTOMER") {
    await prisma.customerProfile.upsert({
      where: { userId: user.id },
      update: { onboardingComplete: true },
      create: { userId: user.id, onboardingComplete: true },
    });
  }

  if (selectedRole === "SKILLED_PROVIDER") {
    await prisma.skilledProviderProfile.upsert({
      where: { userId: user.id },
      update: { onboardingComplete: true, headline: config.headline, availableForWork: true },
      create: { userId: user.id, onboardingComplete: true, headline: config.headline, availableForWork: true },
    });
  }

  if (selectedRole === "LABOURER") {
    await prisma.labourerProfile.upsert({
      where: { userId: user.id },
      update: { onboardingComplete: true, headline: config.headline, availableForWork: true },
      create: { userId: user.id, onboardingComplete: true, headline: config.headline, availableForWork: true },
    });
  }

  if (selectedRole === "CONTRACTOR") {
    await prisma.contractorProfile.upsert({
      where: { userId: user.id },
      update: { onboardingComplete: true, businessName: "Test Contractor", headline: config.headline, availableForWork: true },
      create: { userId: user.id, onboardingComplete: true, businessName: "Test Contractor", headline: config.headline, availableForWork: true },
    });
  }

  if (selectedRole === "MATERIAL_SUPPLIER") {
    await prisma.materialSupplierProfile.upsert({
      where: { userId: user.id },
      update: { onboardingComplete: true, businessName: "Test Material Supplier", headline: config.headline },
      create: { userId: user.id, onboardingComplete: true, businessName: "Test Material Supplier", headline: config.headline },
    });
  }

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
