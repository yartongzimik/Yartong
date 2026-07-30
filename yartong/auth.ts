import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";

import { isAuthBypassEnabled } from "./lib/phase-flags";
import { prisma } from "./lib/prisma";

const providers: Provider[] = [];

export const isQaTestAccessEnabled = isAuthBypassEnabled;
export const isGoogleAuthConfigured = !isAuthBypassEnabled && Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
export const isFacebookAuthConfigured = !isAuthBypassEnabled && Boolean(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET);
export const isDemoLoginEnabled = false;

if (isGoogleAuthConfigured) providers.push(Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }));
if (isFacebookAuthConfigured) providers.push(Facebook({ clientId: process.env.AUTH_FACEBOOK_ID, clientSecret: process.env.AUTH_FACEBOOK_SECRET }));

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.primaryRole = user.primaryRole;
      session.user.accountStatus = user.accountStatus;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.user.update({ where: { id: user.id }, data: { displayName: user.name?.trim() || "", accountStatus: "ACTIVE", primaryRole: "ONBOARDING_PENDING" } });
    },
  },
});
