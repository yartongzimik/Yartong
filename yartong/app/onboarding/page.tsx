import { redirect } from "next/navigation";

import { requireOnboardingUser, isOnboardingComplete } from "@/lib/authz";
import { getDashboardForRole, PUBLIC_ONBOARDING_ROLES, type PublicOnboardingRole } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const user = await requireOnboardingUser();
  if (isOnboardingComplete(user)) redirect(getDashboardForRole(user.primaryRole));

  const params = await searchParams;
  const requestedRole = params.role as PublicOnboardingRole | undefined;
  const initialRole = requestedRole && PUBLIC_ONBOARDING_ROLES.includes(requestedRole) ? requestedRole : "CUSTOMER";

  const locations = await prisma.location.findMany({ where: { isActive: true }, orderBy: [{ isPrimary: "desc" }, { name: "asc" }], select: { id: true, name: true, district: true, state: true, country: true } });

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8"><section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-2xl shadow-fuchsia-950/30 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Registration</p><h1 className="mt-3 text-4xl font-black">Set up your Yartong account</h1><p className="mt-4 max-w-3xl text-white/70">Confirm your account type, select an active location such as Senapati when available, and add the essential details needed for your dashboard.</p><div className="mt-8"><OnboardingForm locations={locations} initialName={user.displayName || user.email || ""} initialRole={initialRole} /></div></section></main>;
}
