import { redirect } from "next/navigation";

import { requireOnboardingUser, isOnboardingComplete } from "@/lib/authz";
import { getDashboardForRole } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await requireOnboardingUser();
  if (isOnboardingComplete(user)) redirect(getDashboardForRole(user.primaryRole));
  const locations = await prisma.location.findMany({ where: { isActive: true }, orderBy: [{ isPrimary: "desc" }, { name: "asc" }], select: { id: true, name: true, district: true, state: true, country: true } });
  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8"><section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-2xl shadow-fuchsia-950/30 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Step 2 of 4 · Choose account type</p><h1 className="mt-3 text-4xl font-black">Choose how you want to use Yartong</h1><p className="mt-4 max-w-3xl text-white/70">Your Google account only establishes your secure login. Now choose Customer, Skilled Provider, Labourer, Contractor, or Material Supplier. The form will reveal the details required for that role, create the matching Yartong profile, and then send you to the correct dashboard.</p><div className="mt-6 rounded-2xl border border-fuchsia-200/20 bg-fuchsia-400/5 p-4 text-sm text-white/70"><span className="font-bold text-white">Signup flow:</span> Google sign-in → account type → role-specific profile → dashboard.</div><div className="mt-8"><OnboardingForm locations={locations} initialName={user.displayName || user.email || ""} /></div></section></main>;
}
