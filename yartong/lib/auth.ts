import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AccountStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { canAccessProtectedFeatures } from "./account-status";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const enableDevCredentials = process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_CREDENTIALS === "true";

const providers = [
  ...(googleClientId && googleClientSecret
    ? [Google({ clientId: googleClientId, clientSecret: googleClientSecret })]
    : []),
  ...(enableDevCredentials
    ? [
        Credentials({
          name: "Development demo account",
          credentials: { email: { label: "Email", type: "email" } },
          async authorize(credentials) {
            const email = typeof credentials?.email === "string" ? credentials.email : null;
            if (!email) return null;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !canAccessProtectedFeatures(user.accountStatus)) return null;
            return { id: user.id, name: user.name, email: user.email, image: user.image };
          },
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  callbacks: {
    async signIn({ user }) {
      if (!user.email && !user.id) return false;
      const persistedUser = await prisma.user.findFirst({
        where: { OR: [{ id: user.id ?? "" }, { email: user.email ?? undefined }] },
        select: { accountStatus: true },
      });
      return persistedUser ? canAccessProtectedFeatures(persistedUser.accountStatus) : true;
    },
    async session({ session, user }) {
      const persistedUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, primaryRole: true, accountStatus: true },
      });
      if (!persistedUser || !canAccessProtectedFeatures(persistedUser.accountStatus)) {
        session.user = { ...session.user, id: user.id, accountStatus: AccountStatus.BLOCKED };
        return session;
      }
      session.user = {
        ...session.user,
        id: persistedUser.id,
        primaryRole: persistedUser.primaryRole,
        accountStatus: persistedUser.accountStatus,
      };
      return session;
    },
  },
});
