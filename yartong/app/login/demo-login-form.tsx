"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signInWithDemo } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="min-h-11 rounded-full bg-fuchsia-400 px-5 py-3 text-sm font-bold text-[#12051c] transition hover:bg-fuchsia-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Signing in…" : "Use demo login"}</button>;
}

export function DemoLoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action] = useActionState(signInWithDemo, undefined);
  return <form action={action} className="space-y-3">
    <input type="hidden" name="callbackUrl" value={callbackUrl} />
    <label htmlFor="demo-email" className="block text-sm font-semibold text-white">Demo email</label>
    <input id="demo-email" name="email" type="email" placeholder="customer.demo@yartong.local" className="min-h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-200/40" />
    {state?.error ? <p role="alert" className="text-sm text-rose-200">{state.error}</p> : null}
    <SubmitButton />
  </form>;
}
