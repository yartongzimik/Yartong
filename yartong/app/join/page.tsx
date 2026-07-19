import Link from "next/link";

import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";

export default async function JoinPage() {
  await redirectAuthenticatedUser();
  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8"><section className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Join Yartong</p><h1 className="mt-3 max-w-3xl text-4xl font-black sm:text-6xl">Register, choose your role, and finish onboarding.</h1><p className="mt-5 max-w-3xl text-lg text-white/70">Public registration is available for customers, skilled providers, labourers, contractors and material suppliers. Admin accounts are never available through public onboarding.</p><div className="mt-8"><Link href="/login?callbackUrl=/onboarding" className="rounded-full bg-white px-6 py-3 font-black text-[#160620] hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Start with secure login</Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PUBLIC_ONBOARDING_ROLES.map((role) => <article key={role} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="text-xl font-black">{ROLE_LABELS[role]}</h2><p className="mt-2 text-sm text-white/65">{ROLE_DESCRIPTIONS[role]}</p></article>)}</div></section></main>;
}
