"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { isQaTestAccessEnabled, signIn } from "@/auth";

const QA_ACCOUNT_EMAILS = new Set([
  "customer.demo@yartong.local",
  "provider.demo@yartong.local",
  "labourer.demo@yartong.local",
  "contractor.demo@yartong.local",
  "supplier.demo@yartong.local",
  "admin.demo@yartong.local",
]);

export async function signInWithGoogle(callbackUrl = "/onboarding") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signInWithFacebook(callbackUrl = "/onboarding") {
  await signIn("facebook", { redirectTo: callbackUrl });
}

export async function signInAsQaUser(email: string, callbackUrl = "/") {
  if (!isQaTestAccessEnabled) redirect("/login");

  const normalizedEmail = email.trim().toLowerCase();
  if (!QA_ACCOUNT_EMAILS.has(normalizedEmail)) redirect("/login?error=qa-account-unavailable");

  const cookieStore = await cookies();
  cookieStore.set("yartong_qa_user", normalizedEmail, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(callbackUrl);
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
