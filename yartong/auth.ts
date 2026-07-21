import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";

import { prisma } from "./lib/prisma";

const providers: Provider[] = [];

const SENSITIVE_KEYS = [
  "token",
  "secret",
  "password",
  "authorization",
  "cookie",
  "code_verifier",
  "pkce",
];

function sanitizeAuthDiagnostic(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[max-depth]";

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: sanitizeAuthDiagnostic(value.cause, depth + 1),
    };
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeAuthDiagnostic(item, depth + 1));
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitiveKey) => lowerKey.includes(sensitiveKey))) {
        result[key] = "[redacted]";
      } else {
        result[key] = sanitizeAuthDiagnostic(nestedValue, depth + 1);
      }
    }
    return result;
  }

  if (typeof value === "string") {
    return value.length > 2000 ? `${value.slice(0, 2000)}…` : value;
  }

  return value;
}

function summarizeAuthError(error: unknown) {
  return sanitizeAuthDiagnostic(error);
}

export const isGoogleAuthConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const isFacebookAuthConfigured = Boolean(
  process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET,
);

export const isDemoLoginEnabled =
  process.env.ENABLE_DEMO_LOGIN === "true" && Boolean(process.env.DEMO_LOGIN_PASSWORD);

if (isGoogleAuthConfigured) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (isFacebookAuthConfigured) {
  providers.push(
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  );
}

if (isDemoLoginEnabled) {
  providers.push(
    Credentials({
      name: "Demo email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password || password !== process.env.DEMO_LOGIN_PASSWORD) return null;

        const user = await prisma.user.findFirst({
          where: { email, isDemo: true, accountStatus: "ACTIVE" },
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
  logger: {
    error(error) {
      console.error("[auth-diagnostic]", JSON.stringify(summarizeAuthError(error)));
    },
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
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            displayName: user.name?.trim() || "",
            accountStatus: "ACTIVE",
            primaryRole: "ONBOARDING_PENDING",
          },
        });
      } catch (error) {
        console.error(
          "[auth-create-user-diagnostic]",
          JSON.stringify(summarizeAuthError(error)),
        );
        throw error;
      }
    },
  },
});