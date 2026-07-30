import Link from "next/link";

import { isFacebookAuthConfigured, isGoogleAuthConfigured } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/authz";
import { PUBLIC_ONBOARDING_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/onboarding";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

import { startRegistrationWithoutAuth } from "../join/actions";
import { signInWithFacebook, signInWithGoogle } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  if (!isAuthBypassEnabled) await redirectAuthenticatedUser();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  return <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-950 sm:px-8">
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
        <Link href="/" className="inline-flex items-center text-2xl font-black tracking-[-0.05em] text-[#0b1b36]">YAR<span className="text-amber-400">TONG</span></Link>
        <p className="mt-12 text-xs font-black uppercase tracking-[0.28em] text-blue-600">Secure account access</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">One account. The right workspace.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{isAuthBypassEnabled ? "Choose a role and enter its production-style workspace immediately. Your reusable testing profile keeps edits and activity between visits." : "Sign in securely. New accounts keep the role selected during registration, while existing members return to Yartong without changing their account type."}</p>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-2">Role-aware access</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Secure sign-in</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Homepage return</span>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
        {isAuthBypassEnabled ? <>
          <h2 className="text-3xl font-black">Choose a testing role</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">One tap opens the selected role. The same reusable testing profile is used on later visits.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PUBLIC_ONBOARDING_ROLES.map((role) => <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}>
              <button className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-300 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
                <span className="block font-black text-slate-950">{ROLE_LABELS[role]}</span>
                <span className="mt-2 block text-xs leading-5 text-slate-500">{ROLE_DESCRIPTIONS[role]}</span>
              </button>
            </form>)}
          </div>
          <p className="mt-5 text-center text-xs text-slate-400">Authentication and payment execution remain disabled during this build phase.</p>
        </> : <>
          <h2 className="text-3xl font-black">Log in to Yartong</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Continue securely, then return to the homepage or finish your profile when creating a new account.</p>
          {params.error ? <p role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">Authentication did not complete. Please try again.</p> : null}
          <div className="mt-6 space-y-3">
            {isGoogleAuthConfigured ? <form action={async () => { "use server"; await signInWithGoogle(callbackUrl); }}><button className="min-h-12 w-full rounded-full border border-slate-200 bg-white px-5 py-3 font-black text-slate-950 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]">Continue with Google</button></form> : null}
            {isFacebookAuthConfigured ? <form action={async () => { "use server"; await signInWithFacebook(callbackUrl); }}><button className="min-h-12 w-full rounded-full bg-blue-600 px-5 py-3 font-black text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]">Continue with Facebook</button></form> : null}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">New to Yartong? <Link href="/join" className="font-bold text-blue-700 underline underline-offset-4">Choose an account type</Link></p>
        </>}
      </div>
    </section>
  </main>;
}
