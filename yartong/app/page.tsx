import { Hero } from "@/components/home/hero";
import { MarketplaceCarousel } from "@/components/home/marketplace-carousel";
import { PublicShell } from "@/components/layout/public-shell";

export default function Home() {
  return <PublicShell><main className="bg-[#f7f8fa]"><div className="mx-auto w-full max-w-[1600px]"><Hero /><MarketplaceCarousel /></div></main></PublicShell>;
}
