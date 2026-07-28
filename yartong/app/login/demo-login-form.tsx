"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { signInWithDemo } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="min-h-12 w-full rounded-full bg-fuchsia-400 px-5 py-3 font-black text-[#12051c] transition hover:bg-fuchsia-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Signing in…" : "Log in with email"}</button>;
}

export function DemoLoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action] = useActionState(signInWithDemo, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return <form action={action} className="space-y-4">
    <input type="hidden" name="callbackUrl" value={callbackUrl} />
    <div>
      <label htmlFor="demo-email" className="mb-2 block text-sm font-semibold text-white">Email</label>
      <input id="demo-email" name="email" type="email" autoComplete="email" placeholder="customer.demo@yartong.local" className="min-h-12 w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-200/30" />
    </div>
    <div>
      <label htmlFor="demo-password" className="mb-2 block text-sm font-semibold text-white">Password</label>
      <div className="relative">
        <input id="demo-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Demo password" className="min-h-12 w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 pr-20 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-200/30" />
        <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-xs font-bold text-fuchsia-200">{showPassword ? "Hide" : "Show"}</button>
      </div>
    </div>
    {state?.error ? <p role="alert" className="rounded-xl border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-100">{state.error}</p> : null}
    <label className="flex items-center gap-2 text-sm text-white/60"><input type="checkbox" className="size-4 accent-fuchsia-400" /> Remember me on this device</label>
    <SubmitButton />
    <p className="text-center text-xs leading-5 text-white/45">Demo email login only works for seeded accounts and never creates a real customer account.</p>
  </form>;
}