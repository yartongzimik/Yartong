import Link from "next/link";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { PUBLIC_NAVIGATION } from "@/lib/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "./primitives";

const primaryNav = PUBLIC_NAVIGATION.filter((item) =>
  ["find-workers", "materials", "quick-jobs", "advertise"].includes(item.id),
);

export function PublicHeader() {
  return (
    <header className="public-header">
      <Container className="header-inner">
        <Link className="brand" href={ROUTES.home} aria-label={`${PLATFORM.name} home`}>
          <span className="brand-mark">Y</span>
          <span>{PLATFORM.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Public navigation">
          {primaryNav.map((item) => (
            <Link key={item.id} href={item.href}>{item.label === "Advertise" ? "Grow Your Business" : item.label}</Link>
          ))}
          <Link href={ROUTES.trades}>Find Contractors</Link>
        </nav>
        <div className="header-actions">
          <Link className="login-link" href={ROUTES.login}>Login</Link>
          <ButtonLink href={ROUTES.join} variant="secondary">Join Yartong</ButtonLink>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <div className="mobile-menu-panel">
            {primaryNav.map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}
            <Link href={ROUTES.trades}>Find Contractors</Link>
            <Link href={ROUTES.login}>Login</Link>
            <Link href={ROUTES.join}>Join Yartong</Link>
          </div>
        </details>
      </Container>
    </header>
  );
}
