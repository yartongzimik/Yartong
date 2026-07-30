import Link from "next/link";

import { isFacebookAuthConfigured, isGoogleAuthConfigured } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/authz";
import { isPublicOnboardingRole, PUBLIC_ONBOARDING_ROLES, ROLE_LABELS } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

import { startRegistrationWithoutAuth } from "../join/actions";
import { signInWithFacebook, signInWithGoogle } from "./actions";

type LoginParams = { role?: string; error?: string };

export default async function LoginPage({ searchParams }: { searchParams: Promise<LoginParams> }) {
  if (!isAuthBypassEnabled) await redirectAuthenticatedUser();

  const params = await searchParams;
  const selectedRole = params.role && isPublicOnboardingRole(params.role) ? params.role : null;
  const callbackUrl = selectedRole ? `/onboarding?role=${selectedRole}` : "/";

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-100 px-4 py-6 text-slate-950">
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]" />
      <section className="relative w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black tracking-[-0.05em] text-[#0b1b36]">YAR<span className="text-amber-400">TONG</span></Link>
          <Link href="/" aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-950">×</Link>
        </div>

        {!selectedRole ? (
          <div className="mt-6">
            <h1 className="text-xl font-black">Choose account type</h1>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {PUBLIC_ONBOARDING_ROLES.map((role) => isAuthBypassEnabled ? (
                <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}>
                  <button className="min-h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black transition hover:border-blue-300 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
                    {ROLE_LABELS[role]}
                  </button>
                </form>
              ) : (
                <Link key={role} href={`/login?role=${role}`} className="grid min-h-14 place-items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-black transition hover:border-blue-300 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
                  {ROLE_LABELS[role]}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-black">{ROLE_LABELS[selectedRole]}</h1>
              <Link href="/login" className="text-xs font-bold text-blue-700">Change</Link>
            </div>

            {params.error ? <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">Authentication did not complete. Please try again.</p> : null}

            <div className="mt-5 space-y-3">
              {isGoogleAuthConfigured ? <form action={async () => { "use server"; await signInWithGoogle(callbackUrl); }}><button className="min-h-12 w-full rounded-full border border-slate-200 bg-white px-5 py-3 font-black shadow-sm transition hover:bg-slate-50 active:scale-[0.99]">Continue with Google</button></form> : null}
              {isFacebookAuthConfigured ? <form action={async () => { "use server"; await signInWithFacebook(callbackUrl); }}><button className="min-h-12 w-full rounded-full bg-blue-600 px-5 py-3 font-black text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]">Continue with Facebook</button></form> : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
