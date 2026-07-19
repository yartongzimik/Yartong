export { auth as proxy } from "./lib/server/auth";

export const config = {
  matcher: [
    "/admin/:path*",
    "/contractor/:path*",
    "/customer/:path*",
    "/messages/:path*",
  ],
};
