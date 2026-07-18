import type { ReactNode } from "react";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout for all public-facing Yartong pages.
 *
 * Examples:
 * - Homepage
 * - Worker and contractor discovery
 * - Material marketplace
 * - Quick Jobs
 * - Public profiles
 * - Login and registration
 * - Informational and legal pages
 *
 * Authenticated dashboards will use separate role-specific layouts.
 */
export default function PublicLayout({
  children,
}: Readonly<PublicLayoutProps>) {
  return (
    <>
      <SiteHeader />

      <main className="site-main">
        {children}
      </main>

      <SiteFooter />
    </>
  );
}