import { AdvertisingRail } from "@/components/home/advertising-rail";
import { Hero } from "@/components/home/hero";
import { MarketplaceShowcase } from "@/components/home/marketplace-showcase";
import { PublicShell } from "@/components/layout/public-shell";

export default function Home() {
  return (
    <PublicShell>
      <div className="mx-auto grid w-full max-w-[1540px] gap-4 xl:grid-cols-[minmax(0,1fr)_330px] xl:px-4">
        <div className="min-w-0">
          <Hero />
          <MarketplaceShowcase />
        </div>
        <div className="px-4 pb-8 pt-4 xl:px-0 xl:pt-5">
          <div className="sticky top-40">
            <AdvertisingRail />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}