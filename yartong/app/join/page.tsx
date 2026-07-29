import Link from "next/link";

import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";

export default async function JoinPage() {
  await redirectAuthenticatedUser();

  return <main className="relative min-h-screen overflow-hidden bg-[#07050D] px-5 py-8 text-white sm:px-8 sm:py-12">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.14),transparent_42%)]" />
    <div className="pointer-events-none absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

    <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
      <div role="dialog" aria-modal="true" aria-labelledby="join-title" className="w-full rounded-[2rem] border border-white/15 bg-[#11091b]/95 p-6 shadow-2xl shadow-fuchsia-950/40 sm:p-9">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200">Join Yartong</p>
            <h1 id="join-title" className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Choose how you want to use Yartong.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/65">Pick one public account type. After that, Yartong takes you to secure sign-in and then the profile setup for that role.</p>
          </div>
          <Link href="/" aria-label="Close join dialog" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-xl text-white/60 transition hover:bg-white/10 hover:text-white">×</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PUBLIC_ONBOARDING_ROLES.map((role) => {
            const callbackUrl = `/onboarding?role=${role}`;
            const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

            return <Link
              key={role}
              href={loginHref}
              className="group rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-0.5 hover:border-fuchsia-200/60 hover:bg-fuchsia-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{ROLE_LABELS[role]}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">{ROLE_DESCRIPTIONS[role]}</p>
                </div>
                <span aria-hidden="true" className="text-xl text-fuchsia-200 transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-5 text-sm font-bold text-fuchsia-200">Continue as {ROLE_LABELS[role]}</p>
            </Link>;
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm">
          <p className="text-white/45">Administrative accounts are not available through public registration.</p>
          <p className="text-white/50">Already have an account? <Link href="/login" className="font-bold text-fuchsia-200 underline underline-offset-4">Log in</Link>.</p>
        </div>
      </div>
    </section>
  </main>;
}
