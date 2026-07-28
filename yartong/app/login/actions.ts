"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { isQaTestAccessEnabled, signIn } from "@/auth";

export async function signInWithGoogle(callbackUrl = "/onboarding") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signInWithFacebook(callbackUrl = "/onboarding") {
  await signIn("facebook", { redirectTo: callbackUrl });
}

export async function signInAsQaUser(email: string, callbackUrl = "/") {
  if (!isQaTestAccessEnabled) redirect("/login");

  try {
    await signIn("credentials", { email, password: "", redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=qa-account-unavailable");
    throw error;
  }
}

export async function signInWithDemo(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/onboarding");
  if (!email) return { error: "Enter a demo user email address." };
  if (!isQaTestAccessEnabled && !password) return { error: "Enter the demo password." };

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) return { error: "That demo account is not available." };
    throw error;
  }

  redirect(callbackUrl);
}