"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

export async function signInWithGoogle(callbackUrl = "/onboarding") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signInWithFacebook(callbackUrl = "/onboarding") {
  await signIn("facebook", { redirectTo: callbackUrl });
}

export async function signInWithDemo(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/onboarding");
  if (!email) return { error: "Enter a demo user email address." };
  if (!password) return { error: "Enter the demo password." };

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) return { error: "That demo email or password is not valid." };
    throw error;
  }

  redirect(callbackUrl);
}