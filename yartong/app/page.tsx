import { Hero } from "@/components/home/hero";
import { PublicHeader } from "@/components/home/public-header";
import { Recommendations } from "@/components/home/recommendations";
import { PublicFooter, TrustAndGrowth } from "@/components/home/trust-growth-footer";

export default function Home() {
  return (
    <main className="public-shell">
      <PublicHeader />
      <Hero />
      <Recommendations />
      <TrustAndGrowth />
      <PublicFooter />
    </main>
  );
}
