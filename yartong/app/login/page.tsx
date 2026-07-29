import Link from "next/link";

import { isFacebookAuthConfigured, isGoogleAuthConfigured } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/authz";
import { isAuthBypassEnabled } from "@/lib/phase-flags";

import { signInWithFacebook, signInWithGoogle } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  if (!isAuthBypassEnabled) await redirectAuthenticatedUser();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8">
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/[0.04] to-transparent p-8 sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-200">Yartong access</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Build the account first. Turn authentication on later.</h1>
        <p className="mt-5 text-lg leading-8 text-white/70">{isAuthBypassEnabled ? "Authentication is temporarily disabled for this build phase. Accounts created now use the real production database models, dashboards and profile workflows without seeded demo users." : "Sign in securely to continue to Yartong."}</p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-xl sm:p-8">
        {isAuthBypassEnabled ? <>
          <h2 className="text-3xl font-black">Authentication paused</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">Create a normal Yartong account by choosing a public role. No Google, Facebook, demo password or seeded account is used.</p>
          <Link href="/join" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 py-3 font-black text-[#160620]">Choose account type</Link>
          <p className="mt-5 text-center text-xs text-white/40">Secure authentication will be re-enabled through the phase configuration before launch.</p>
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
