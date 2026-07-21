import Link from "next/link";

import { isDemoLoginEnabled, isFacebookAuthConfigured, isGoogleAuthConfigured } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/authz";

import { signInWithFacebook, signInWithGoogle } from "./actions";
import { DemoLoginForm } from "./demo-login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/onboarding";
  const hasProviders = isGoogleAuthConfigured || isFacebookAuthConfigured || isDemoLoginEnabled;

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8">
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-white/[0.04] to-transparent p-8 shadow-2xl shadow-fuchsia-950/30 sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-200">Yartong access</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Find work. Hire locally. Build trust.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Sign in with Google or Facebook. New users continue to account-type selection and role-specific onboarding before reaching their dashboard.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Sign in"],
            ["2", "Choose account type"],
            ["3", "Complete your profile"],
          ].map(([step, label]) => <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-xs font-black text-fuchsia-200">STEP {step}</span><p className="mt-2 text-sm font-bold">{label}</p></div>)}
        </div>
        <Link href="/join" className="mt-7 inline-flex rounded-full border border-white/15 px-5 py-3 font-bold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Create a new account</Link>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-xl sm:p-8">
        <h2 className="text-3xl font-black">Log in to Yartong</h2>
        <p className="mt-2 text-sm text-white/55">Use a connected account or a seeded demo email.</p>
        {params.error ? <p role="alert" className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">Authentication did not complete. Please try again.</p> : null}
        {!hasProviders ? <p className="mt-5 rounded-2xl border border-amber-200/25 bg-amber-300/10 p-4 text-sm text-amber-100">No sign-in provider is configured. Add Google or Facebook credentials, or enable demo login.</p> : null}

        <div className="mt-6 space-y-3">
          {isGoogleAuthConfigured ? <form action={async () => { "use server"; await signInWithGoogle(callbackUrl); }}><button className="min-h-12 w-full rounded-full border border-white/15 bg-white px-5 py-3 font-black text-[#160620] transition hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Continue with Google</button></form> : null}
          {isFacebookAuthConfigured ? <form action={async () => { "use server"; await signInWithFacebook(callbackUrl); }}><button className="min-h-12 w-full rounded-full border border-blue-300/30 bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">Continue with Facebook</button></form> : <div className="min-h-12 w-full rounded-full border border-white/10 px-5 py-3 text-center text-sm font-bold text-white/35">Facebook login appears after credentials are configured</div>}
        </div>

        {isDemoLoginEnabled ? <>
          <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-white/10" /><span className="text-xs font-black uppercase tracking-[0.25em] text-white/35">Demo email</span><span className="h-px flex-1 bg-white/10" /></div>
          <DemoLoginForm callbackUrl={callbackUrl} />
        </> : <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/45">Demo email login is disabled. Enable it only in the deployment environment used for QA.</p>}

        <p className="mt-6 text-center text-sm text-white/50">New to Yartong? <Link href="/join" className="font-bold text-fuchsia-200 underline underline-offset-4">Sign up and choose your role</Link></p>
      </div>
    </section>
  </main>;
}