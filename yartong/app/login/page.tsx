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

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8">
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/[0.04] to-transparent p-8 sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-200">Yartong access</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Test the real product without authentication.</h1>
        <p className="mt-5 text-lg leading-8 text-white/70">{isAuthBypassEnabled ? "Choose a role and enter its production-style dashboard immediately. Profile fields such as name, phone, location, skills and experience remain available for editing, but you do not need to fill them every time you test." : "Sign in securely to continue to Yartong."}</p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-xl sm:p-8">
        {isAuthBypassEnabled ? <>
          <h2 className="text-3xl font-black">Choose a testing role</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">One tap opens the selected role. The same reusable testing profile is used on later visits, so edits and activity can persist between tests.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PUBLIC_ONBOARDING_ROLES.map((role) => <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}>
              <button className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-left transition hover:border-fuchsia-200/50 hover:bg-fuchsia-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">
                <span className="block font-black">{ROLE_LABELS[role]}</span>
                <span className="mt-2 block text-xs leading-5 text-white/50">{ROLE_DESCRIPTIONS[role]}</span>
              </button>
            </form>)}
          </div>
          <p className="mt-5 text-center text-xs text-white/40">Authentication and payment execution remain disabled during this build phase.</p>
        </> : <>
          <h2 className="text-3xl font-black">Log in to Yartong</h2>
          {params.error ? <p role="alert" className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">Authentication did not complete. Please try again.</p> : null}
          <div className="mt-6 space-y-3">
            {isGoogleAuthConfigured ? <form action={async () => { "use server"; await signInWithGoogle(callbackUrl); }}><button className="min-h-12 w-full rounded-full bg-white px-5 py-3 font-black text-[#160620]">Continue with Google</button></form> : null}
            {isFacebookAuthConfigured ? <form action={async () => { "use server"; await signInWithFacebook(callbackUrl); }}><button className="min-h-12 w-full rounded-full bg-blue-600 px-5 py-3 font-black text-white">Continue with Facebook</button></form> : null}
          </div>
          <p className="mt-6 text-center text-sm text-white/50">New to Yartong? <Link href="/join" className="font-bold text-fuchsia-200 underline underline-offset-4">Create an account</Link></p>
        </>}
      </div>
    </section>
  </main>;
}
