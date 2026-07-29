import Link from "next/link";

import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

import { startRegistrationWithoutAuth } from "./actions";

export default async function JoinPage() {
  await redirectAuthenticatedUser();

  return <main className="relative min-h-screen overflow-hidden bg-[#07050D] px-4 py-6 text-white sm:px-6">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.12),transparent_42%)]" />
    <div className="pointer-events-none absolute inset-0 bg-black/55 backdrop-blur-[3px]" />
    <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
      <div role="dialog" aria-modal="true" aria-labelledby="join-title" className="w-full max-w-2xl rounded-[1.5rem] border border-white/15 bg-[#120b19]/95 p-5 shadow-2xl shadow-black/60 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Join Yartong</p>
            <h1 id="join-title" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Choose your account type</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">{isAuthBypassEnabled ? "Authentication is temporarily disabled while Yartong is being built. Choose a role and complete the real production account setup." : "Select how you want to use Yartong. You can complete your profile after secure sign-in."}</p>
          </div>
          <Link href="/" aria-label="Close join dialog" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-2xl leading-none text-white/55 transition hover:bg-white/10 hover:text-white">×</Link>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {PUBLIC_ONBOARDING_ROLES.map((role) => {
            const card = <div className="flex items-center justify-between gap-4"><div className="min-w-0"><h2 className="text-base font-black">{ROLE_LABELS[role]}</h2><p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">{ROLE_DESCRIPTIONS[role]}</p></div><span aria-hidden="true" className="shrink-0 text-lg text-fuchsia-200">→</span></div>;
            const className = "group w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-left transition hover:border-fuchsia-200/50 hover:bg-fuchsia-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100";
            if (isAuthBypassEnabled) return <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}><button className={className}>{card}</button></form>;
            const callbackUrl = `/onboarding?role=${role}`;
            return <Link key={role} href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={className}>{card}</Link>;
          })}
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-white/45">
          {isAuthBypassEnabled ? "No seeded account or external login is used in this build phase." : <>Already have an account? <Link href="/login" className="font-bold text-fuchsia-200 underline underline-offset-4">Log in</Link></>}
        </div>
      </div>
    </section>
  </main>;
}
