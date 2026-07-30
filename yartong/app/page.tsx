import { AdvertisingRail } from "@/components/home/advertising-rail";
import { Hero } from "@/components/home/hero";
import { MarketplaceShowcase } from "@/components/home/marketplace-showcase";
import { PublicShell } from "@/components/layout/public-shell";

export default function Home() {
  return (
    <PublicShell>
      <div className="bg-[#f7f8fa]">
        <div className="mx-auto grid w-full max-w-[1600px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 border-r border-slate-200">
            <Hero />
            <MarketplaceShowcase />
          </div>
          <div className="px-3 pb-8 pt-0">
            <div className="sticky top-36">
              <AdvertisingRail />
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}