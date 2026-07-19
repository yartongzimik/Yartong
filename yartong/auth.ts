import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./lib/prisma";

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (
  process.env.NODE_ENV !== "production" &&
  process.env.ENABLE_DEV_CREDENTIALS === "true"
) {
  providers.push(
    Credentials({
      name: "Demo user",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase();
        if (!email) return null;

        const user = await prisma.user.findFirst({
          where: { email, isDemo: true },
        });

        if (!user) return null;

        return {
          id: user.id,
          name: user.displayName,
          email: user.email,
          image: user.image,
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
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.primaryRole = user.primaryRole;
      session.user.accountStatus = user.accountStatus;
      return session;
    },
  },
});
