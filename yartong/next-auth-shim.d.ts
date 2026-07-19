declare module "next-auth" {
  interface User {
    id: string;
    primaryRole: import("./lib/types").UserRole;
    accountStatus: import("./lib/types").AccountStatus;
  }

  interface Session {
    user: User;
  }

  interface AuthToken {
    userId: string;
    primaryRole: import("./lib/types").UserRole;
    accountStatus: import("./lib/types").AccountStatus;
  }

  interface NextAuthConfig {
    providers: unknown[];
    callbacks?: {
      authorized?: (params: { auth: Session | null }) => boolean;
      jwt?: (params: { token: Partial<AuthToken>; user?: User }) => Partial<AuthToken>;
      session?: (params: { session: Session; token: Partial<AuthToken> }) => Session;
    };
  }

  export default function NextAuth(config: NextAuthConfig): {
    auth: (request?: Request) => Response | Promise<Response>;
    handlers: { GET: (request: Request) => Response | Promise<Response>; POST: (request: Request) => Response | Promise<Response> };
    signIn: unknown;
    signOut: unknown;
  };
}

declare module "next-auth/providers/google" {
  export default function Google(config: {
    clientId: string;
    clientSecret: string;
  }): unknown;
}
