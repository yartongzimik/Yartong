import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PublicShell } from "@/components/layout/public-shell";
import { PLATFORM, ROUTES } from "@/lib/constants";

const categories = ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Labour Team"];
const pathways = [
  { title: "Find workers & services", text: "Compare skilled providers, labourers and contractors by trust signals before price.", href: ROUTES.workers },
  { title: "Post construction work", text: "Describe the job once and prepare to receive better-matched local interest.", href: ROUTES.postJob },
  { title: "Explore quick jobs", text: "Short-duration opportunities for urgent site support and daily work discovery.", href: ROUTES.quickJobs },
  { title: "Join as a business", text: "Create a foundation for future leads, materials enquiries and growth analytics.", href: ROUTES.join },
];

export default function Home() {
  return (
    <PublicShell>
      <section className="hero">
        <Container className="hero__grid">
          <div className="hero__content">
            <Badge tone="trust">Senapati-first construction marketplace</Badge>
            <h1>Find trusted construction people and suppliers before comparing price.</h1>
            <p>
              {PLATFORM.name} connects Customers, Skilled Providers, Labourers, Contractors and Material Suppliers with a premium local marketplace built for trust, business growth and scalable expansion.
            </p>
            <div className="hero__actions">
              <ButtonLink href={ROUTES.workers} size="lg">Find workers</ButtonLink>
              <ButtonLink href={ROUTES.postJob} variant="outline" size="lg">Post work</ButtonLink>
            </div>
            <div className="hero__search" role="search" aria-label="Marketplace search preview">
              <label htmlFor="home-search">Search services, workers or materials</label>
              <div>
                <input id="home-search" type="search" placeholder="Mason, plumber, contractor, cement supplier..." />
                <ButtonLink href={ROUTES.workers} variant="secondary">Search</ButtonLink>
              </div>
            </div>
          </div>
          <Card className="hero__panel">
            <p className="eyebrow">Marketplace readiness</p>
            <h2>Built around trust signals</h2>
            <ul>
              <li><strong>Verified profiles</strong><span>Prepared for identity, business and quality indicators.</span></li>
              <li><strong>Business growth</strong><span>Clear pathways for providers, contractors and suppliers.</span></li>
              <li><strong>Local expansion</strong><span>Senapati launch model with reusable architecture.</span></li>
            </ul>
          </Card>
        </Container>
      </section>

      <Container>
        <Section eyebrow="Start here" title="Choose the fastest path for your construction need" description="Milestone 1 establishes the public shell and polished design foundation without shipping full marketplace workflows yet.">
          <div className="pathway-grid">
            {pathways.map((item) => (
              <Card interactive key={item.title} className="pathway-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ButtonLink href={item.href} variant="ghost" size="sm">Explore</ButtonLink>
              </Card>
            ))}
          </div>
        </Section>

        <Section eyebrow="Popular categories" title="Construction services people search for first">
          <div className="category-grid">
            {categories.map((item) => <Card interactive key={item} className="category-card">{item}</Card>)}
          </div>
        </Section>
      </Container>
    </PublicShell>
  );
}
