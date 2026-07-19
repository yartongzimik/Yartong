import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { canAccessProtectedRoutes } from "../account-status";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers = googleClientId && googleClientSecret
  ? [Google({ clientId: googleClientId, clientSecret: googleClientSecret })]
  : [];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  callbacks: {
    authorized({ auth: session }) {
      const accountStatus = session?.user.accountStatus;
      return Boolean(accountStatus && canAccessProtectedRoutes(accountStatus));
    },
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.primaryRole = user.primaryRole;
        token.accountStatus = user.accountStatus;
      }

      return token;
    },
    session({ session, token }) {
      if (token.userId && token.primaryRole && token.accountStatus) {
        session.user.id = token.userId;
        session.user.primaryRole = token.primaryRole;
        session.user.accountStatus = token.accountStatus;
      }

      return session;
    },
  },
});

export const { GET, POST } = handlers;
