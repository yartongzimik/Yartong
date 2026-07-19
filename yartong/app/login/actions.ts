"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

export async function signInWithGoogle(callbackUrl = "/onboarding") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signInWithDemo(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const callbackUrl = String(formData.get("callbackUrl") ?? "/onboarding");
  if (!email) return { error: "Enter a demo user email address." };

  try {
    await signIn("credentials", { email, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) return { error: "We could not sign you in with that demo account." };
    throw error;
  }

  redirect(callbackUrl);
}
