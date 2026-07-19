import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import type { UserRole } from "@/lib/types";

const yartongRoles = ["CUSTOMER", "SKILLED_PROVIDER", "LABOURER", "CONTRACTOR", "MATERIAL_SUPPLIER", "ADMIN"] as const satisfies readonly UserRole[];

function isYartongRole(value: unknown): value is UserRole {
  return typeof value === "string" && yartongRoles.includes(value as UserRole);
}

export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET, allowDangerousEmailAccountLinking: false }),
    Credentials({
      id: "development-credentials",
      name: "Development credentials",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        if (process.env.NODE_ENV === "production") return null;
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        if (!email.endsWith("@example.test")) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || user.accountStatus !== "ACTIVE") return null;
        return { id: user.id, name: user.displayName, email: user.email, image: user.profileImageUrl };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const persistedUser = await db.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: { displayName: user.name ?? user.email, name: user.name, profileImageUrl: user.image, image: user.image, lastActiveAt: new Date() },
        create: { displayName: user.name ?? user.email, name: user.name, email: user.email.toLowerCase(), profileImageUrl: user.image, image: user.image, primaryRole: "CUSTOMER", accountStatus: "ACTIVE", verificationStatus: "UNVERIFIED", lastActiveAt: new Date() },
      });
      user.id = persistedUser.id;
      return true;
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;
      if (!userId) return token;
      const persistedUser = await db.user.findUnique({ where: { id: userId }, select: { id: true, displayName: true, email: true, profileImageUrl: true, primaryRole: true, accountStatus: true, verificationStatus: true } });
      if (!persistedUser) return token;
      token.sub = persistedUser.id;
      token.name = persistedUser.displayName;
      token.email = persistedUser.email;
      token.picture = persistedUser.profileImageUrl;
      token.primaryRole = persistedUser.primaryRole;
      token.accountStatus = persistedUser.accountStatus;
      token.verificationStatus = persistedUser.verificationStatus;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.primaryRole = isYartongRole(token.primaryRole) ? token.primaryRole : "CUSTOMER";
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
} satisfies NextAuthConfig;
