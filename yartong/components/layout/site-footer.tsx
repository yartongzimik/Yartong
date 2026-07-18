import Link from "next/link";
import { PLATFORM, ROUTES } from "@/lib/constants";
import { JOIN_NAVIGATION, PUBLIC_NAVIGATION } from "@/lib/navigation";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__grid">
        <div>
          <Link className="brand" href={ROUTES.home} aria-label={`${PLATFORM.name} home`}>
            <span className="brand__mark" aria-hidden="true">Y</span>
            <span><strong>{PLATFORM.name}</strong><small>Trust before price</small></span>
          </Link>
          <p>{PLATFORM.description} Starting with Senapati, built for data-driven expansion.</p>
        </div>
        <div>
          <h2>Marketplace</h2>
          {PUBLIC_NAVIGATION.filter((item) => item.visibleToPublic).map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <h2>Join</h2>
          {JOIN_NAVIGATION.slice(0, 4).map((item) => <Link key={item.id} href={item.href}>{item.label.replace("Register as ", "")}</Link>)}
        </div>
        <div>
          <h2>Yartong</h2>
          <Link href={ROUTES.postJob}>Post work</Link>
          <Link href={ROUTES.login}>Login</Link>
          <Link href={`mailto:${PLATFORM.supportEmail}`}>Support</Link>
        </div>
      </Container>
      <Container className="site-footer__bottom">
        <span>© 2026 {PLATFORM.name}. All rights reserved.</span>
        <span>{PLATFORM.defaultDistrict}, {PLATFORM.defaultState} first.</span>
      </Container>
    </footer>
  );
}
