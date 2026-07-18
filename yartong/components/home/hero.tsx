import { ROUTES, PLATFORM } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, Container } from "./primitives";

const modes = ["Workers", "Contractors", "Materials", "Quick Jobs"];
const actions = [
  ["Find Workers", ROUTES.workers],
  ["Find Contractors", ROUTES.trades],
  ["Find Materials", ROUTES.materials],
  ["Post a Job", ROUTES.postJob],
  ["Quick Jobs", ROUTES.quickJobs],
] as const;

export function Hero() {
  return (
    <Container className="hero-grid">
      <div className="hero-copy">
        <Badge>Senapati-first construction marketplace</Badge>
        <h1>Build with trusted local talent, contractors, and materials.</h1>
        <p>{PLATFORM.name} helps customers discover verified-ready construction services while helping local businesses grow with better visibility and insights.</p>
        <div className="hero-actions">
          <ButtonLink href={ROUTES.workers}>Find Workers</ButtonLink>
          <ButtonLink href={ROUTES.postJob} variant="secondary">Post a Job</ButtonLink>
        </div>
      </div>
      <Card className="discovery-card">
        <div className="location-pill">📍 {PLATFORM.defaultDistrict}, {PLATFORM.defaultState}</div>
        <div className="segmented" aria-label="Search mode">
          {modes.map((mode, index) => <button className={index === 0 ? "active" : ""} key={mode}>{mode}</button>)}
        </div>
        <label className="search-label" htmlFor="home-search">What do you need?</label>
        <input id="home-search" placeholder="Mason, plumber, cement, site labour..." />
        <p className="mock-note">UI preview only — ready for real marketplace search later.</p>
        <div className="action-grid">
          {actions.map(([label, href]) => <ButtonLink href={href} variant="ghost" key={label}>{label}</ButtonLink>)}
        </div>
      </Card>
    </Container>
  );
}
