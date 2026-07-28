import Link from "next/link";

import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";

export default async function JoinPage() {
  await redirectAuthenticatedUser();

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8">
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Join Yartong</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-black sm:text-6xl">Choose your account type first.</h1>
      <p className="mt-5 max-w-3xl text-lg text-white/70">Select the account type that matches how you want to use Yartong. You will sign in securely next, then complete the profile fields for that role.</p>

      <div className="mt-8">
        <Link href="#account-types" className="rounded-full bg-white px-6 py-3 font-black text-[#160620] hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Choose account type</Link>
      </div>

      <div id="account-types" className="mt-10 grid scroll-mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_ONBOARDING_ROLES.map((role) => {
          const callbackUrl = `/onboarding?role=${role}`;
          const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

          return <Link
            key={role}
            href={loginHref}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-fuchsia-200/60 hover:bg-fuchsia-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{ROLE_LABELS[role]}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
              <span aria-hidden="true" className="text-xl text-fuchsia-200 transition group-hover:translate-x-1">→</span>
            </div>
            <p className="mt-5 text-sm font-bold text-fuchsia-200">Continue as {ROLE_LABELS[role]}</p>
          </Link>;
        })}
      </div>

      <p className="mt-8 text-sm text-white/50">Already have a Yartong account? <Link href="/login" className="font-bold text-fuchsia-200 underline underline-offset-4">Log in</Link>.</p>
    </section>
  </main>;
}
