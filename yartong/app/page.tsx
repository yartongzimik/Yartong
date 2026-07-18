import { DiscoveryRecommendations } from "@/components/home/discovery-recommendations";
import { Hero } from "@/components/home/hero";
import { TrustAndGrowth } from "@/components/home/trust-and-growth";
import { PublicShell } from "@/components/layout/public-shell";

export default function Home() {
  return (
    <PublicShell>
      <Hero />
      <DiscoveryRecommendations />
      <TrustAndGrowth />
    </PublicShell>
  );
}
