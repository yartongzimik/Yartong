import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/lib/types";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isAuthenticated = Boolean(token?.sub);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isProtectedRoute = ["/admin", "/customer", "/messages"].some((path) => nextUrl.pathname.startsWith(path));

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && (token?.primaryRole as UserRole | undefined) !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/customer/:path*", "/messages/:path*"] };
