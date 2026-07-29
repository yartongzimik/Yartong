import Link from "next/link";

import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

import { startRegistrationWithoutAuth } from "./actions";
import { RoleChoiceButton } from "./role-choice-button";

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
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">{isAuthBypassEnabled ? "Testing mode is active. Tap a role once. You will see immediate feedback while its workspace opens." : "Select how you want to use Yartong. You can complete your profile after secure sign-in."}</p>
          </div>
          <Link href="/" aria-label="Close join dialog" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-2xl leading-none text-white/55 transition active:scale-90 hover:bg-white/10 hover:text-white">×</Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PUBLIC_ONBOARDING_ROLES.map((role) => {
            if (isAuthBypassEnabled) {
              return <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}>
                <RoleChoiceButton role={role} label={ROLE_LABELS[role]} description={ROLE_DESCRIPTIONS[role]} />
              </form>;
            }

            const callbackUrl = `/onboarding?role=${role}`;
            return <Link
              key={role}
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="group flex min-h-24 items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-4 shadow-sm transition duration-150 active:scale-[0.985] active:border-fuchsia-200/80 active:bg-fuchsia-400/20 hover:border-fuchsia-200/45 hover:bg-fuchsia-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-300/10 text-lg font-black text-fuchsia-100">→</span>
              <span className="min-w-0 flex-1"><span className="block text-base font-black">{ROLE_LABELS[role]}</span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-white/52">{ROLE_DESCRIPTIONS[role]}</span></span>
              <span aria-hidden="true" className="text-xl font-black text-fuchsia-200 transition group-hover:translate-x-1">→</span>
            </Link>;
          })}
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-white/45">
          {isAuthBypassEnabled ? <>Already testing another role? <Link href="/login" className="font-bold text-fuchsia-200 underline underline-offset-4">Switch account type</Link></> : <>Already have an account? <Link href="/login" className="font-bold text-fuchsia-200 underline underline-offset-4">Log in</Link></>}
        </div>
      </div>
    </section>
  </main>;
}
