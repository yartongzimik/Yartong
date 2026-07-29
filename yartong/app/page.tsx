import { AdvertisingRail } from "@/components/home/advertising-rail";
import { DiscoveryRecommendations } from "@/components/home/discovery-recommendations";
import { Hero } from "@/components/home/hero";
import { IntentPathways } from "@/components/home/intent-pathways";
import { TrustAndGrowth } from "@/components/home/trust-and-growth";
import { PublicShell } from "@/components/layout/public-shell";

export default function Home() {
  return (
    <PublicShell>
      <div className="mx-auto grid w-full max-w-[1540px] gap-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:px-5">
        <div className="min-w-0">
          <Hero />
          <DiscoveryRecommendations />
          <IntentPathways />
          <TrustAndGrowth />
        </div>
        <div className="pt-6 xl:pt-10">
          <div className="sticky top-5">
            <AdvertisingRail />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
