import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";

import { prisma } from "./lib/prisma";

const providers: Provider[] = [];

export const isGoogleAuthConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const isDevCredentialsEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.ENABLE_DEV_CREDENTIALS === "true";

if (isGoogleAuthConfigured) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (isDevCredentialsEnabled) {
  providers.push(
    Credentials({
      name: "Demo user",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        if (!email) return null;

        const user = await prisma.user.findFirst({
          where: { email, isDemo: true },
        });

        if (!user) return null;

        return {
          id: user.id,
          name: user.displayName || user.name,
          email: user.email,
          image: user.image,
          primaryRole: user.primaryRole,
          accountStatus: user.accountStatus,
        };
      },
    }),
  );
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
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
      await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: user.name?.trim() || "",
          accountStatus: "ACTIVE",
          primaryRole: "ONBOARDING_PENDING",
        },
      });
    },
  },
});
