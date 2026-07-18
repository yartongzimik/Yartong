import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { MOCK_CONTRACTOR_PROFILES, MOCK_MATERIAL_PRODUCTS, MOCK_QUICK_JOBS, MOCK_SKILLED_PROVIDER_PROFILES, MOCK_USERS } from "@/lib/mock-data";
import { Card, Container, Section } from "./primitives";

function userName(userId: string) {
  return MOCK_USERS.find((user) => user.id === userId)?.displayName ?? "Yartong member";
}

const panels = [
  { label: "Workers", href: ROUTES.workers, items: MOCK_SKILLED_PROVIDER_PROFILES.slice(0, 2).map((p) => ({ title: p.businessName ?? userName(p.userId), meta: p.headline, stat: `${p.averageRating}★ · ${p.totalReviews} reviews` })) },
  { label: "Contractors", href: ROUTES.trades, items: MOCK_CONTRACTOR_PROFILES.slice(0, 2).map((p) => ({ title: p.businessName, meta: p.headline, stat: `${p.completedProjects} projects · ${p.averageRating}★` })) },
  { label: "Suppliers/Materials", href: ROUTES.materials, items: MOCK_MATERIAL_PRODUCTS.slice(0, 2).map((p) => ({ title: p.name, meta: p.description, stat: p.stockStatus.replaceAll("_", " ").toLowerCase() })) },
  { label: "Quick Jobs", href: ROUTES.quickJobs, items: MOCK_QUICK_JOBS.slice(0, 2).map((p) => ({ title: p.title, meta: p.description, stat: p.urgency.replaceAll("_", " ").toLowerCase() })) },
];

export function Recommendations() {
  return (
    <Section>
      <Container>
        <div className="section-heading"><span>Compact discovery</span><h2>Preview the marketplace without endless scrolling.</h2></div>
        <div className="recommendation-grid">
          {panels.map((panel) => (
            <Card key={panel.label}>
              <div className="panel-heading"><h3>{panel.label}</h3><Link href={panel.href}>View all</Link></div>
              {panel.items.map((item) => <article className="preview-card" key={item.title}><strong>{item.title}</strong><p>{item.meta}</p><span>{item.stat}</span></article>)}
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
