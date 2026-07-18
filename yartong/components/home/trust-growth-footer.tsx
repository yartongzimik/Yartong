import Link from "next/link";
import { JOIN_NAVIGATION } from "@/lib/navigation";
import { ROUTES, PLATFORM } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container, Section } from "./primitives";

const trustItems = [
  ["Verified profiles", "Verification is a platform trust signal for customers, not a paid-only feature."],
  ["Ratings readiness", "Profiles are shaped for reviews, completed jobs, and repeat-customer confidence."],
  ["Platform-first contact", "Discovery starts on Yartong so choices can become safer and more transparent."],
];

export function TrustAndGrowth() {
  return (
    <>
      <Section className="trust-strip"><Container className="trust-grid">{trustItems.map(([title, text]) => <Card key={title}><h3>{title}</h3><p>{text}</p></Card>)}</Container></Section>
      <Section><Container><Card className="growth-card"><div><span>Business Growth</span><h2>Grow your construction business as Yartong expands.</h2><p>Providers, contractors, and material suppliers can prepare for future visibility, promoted listings, and business insights while keeping core discovery open to customers.</p></div><ButtonLink href={ROUTES.advertise} variant="secondary">Grow Your Business / Advertise</ButtonLink></Card></Container></Section>
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <Container className="footer-grid">
        <div><strong>{PLATFORM.name}</strong><p>Customer-first, trust-led construction marketplace for Senapati and future expansion.</p></div>
        <div><h3>Marketplace</h3><Link href={ROUTES.workers}>Find Workers</Link><Link href={ROUTES.trades}>Find Contractors</Link><Link href={ROUTES.materials}>Find Materials</Link><Link href={ROUTES.quickJobs}>Quick Jobs</Link></div>
        <div><h3>Join</h3>{JOIN_NAVIGATION.map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}</div>
      </Container>
    </footer>
  );
}
