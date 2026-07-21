import Link from "next/link";

import { isDevCredentialsEnabled, isGoogleAuthConfigured } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/authz";

import { signInWithGoogle } from "./actions";
import { DemoLoginForm } from "./demo-login-form";

const onboardingSteps = [
  "Continue with Google",
  "Choose account type",
  "Complete role-specific profile",
  "Open your dashboard",
];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/onboarding";
  const hasProviders = isGoogleAuthConfigured || isDevCredentialsEnabled;

  return <main className="min-h-screen bg-[#07050D] px-5 py-10 text-white sm:px-8">
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-fuchsia-950/30 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Yartong signup</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Sign in first. Choose how you use Yartong next.</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70">Google is only the secure account sign-in step. New users are sent straight to Yartong onboarding after sign-in, where they choose Customer, Skilled Provider, Labourer, Contractor, or Material Supplier before any role profile is created.</p>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Yartong signup steps">
          {onboardingSteps.map((step, index) => <li key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><span className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">Step {index + 1}</span><p className="mt-1 font-bold text-white">{step}</p></li>)}
        </ol>

        <p className="mt-6 text-sm text-white/55">Already completed onboarding? Signing in will take you directly to your existing role dashboard. Your role is not silently changed during login.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/join" className="rounded-full border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">View available account types</Link></div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-[#12091d] p-6 shadow-xl sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-200">Step 1 of 4</p>
        <h2 className="mt-2 text-2xl font-black">Continue with a secure account</h2>
        <p className="mt-2 text-sm text-white/65">After Google sign-in, new users continue to account-type selection and role-specific onboarding.</p>
        {params.error ? <p role="alert" className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">Authentication did not complete. Please try again.</p> : null}
        {!hasProviders ? <p className="mt-5 rounded-2xl border border-amber-200/25 bg-amber-300/10 p-4 text-sm text-amber-100">No sign-in provider is configured yet. Add Google credentials or enable development demo credentials locally.</p> : null}
        <div className="mt-6 space-y-6">
          {isGoogleAuthConfigured ? <form action={async () => { "use server"; await signInWithGoogle(callbackUrl); }}><button className="min-h-12 w-full rounded-full bg-white px-5 py-3 font-bold text-[#160620] transition hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Continue with Google</button></form> : null}
          {isDevCredentialsEnabled ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"><p className="mb-4 text-sm text-white/65">Development only. Production builds never show this option.</p><DemoLoginForm callbackUrl={callbackUrl} /></div> : null}
        </div>
      </div>
    </section>
  </main>;
}
