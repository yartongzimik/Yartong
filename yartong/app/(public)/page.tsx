import CategoryGrid from "@/components/home/category-grid";
import FeaturedWorkers from "@/components/home/featured-workers";
import Hero from "@/components/home/hero";
import FeaturedContractors from "@/components/home/featured-contractors";
import FeaturedSuppliers from "@/components/home/featured-suppliers";
import QuickJobs from "@/components/home/quick-jobs";
import Statistics from "@/components/home/statistics";
import Testimonials from "@/components/home/testimonials";
import HomeCta from "@/components/home/cta";
import HowItWorks from "@/components/home/how-it-works";
import TrustSafety from "@/components/home/trust-safety";



export default function HomePage() {
  return (
    <div className="homepage">
      <Hero />
      <CategoryGrid />
      <FeaturedWorkers />
      <FeaturedContractors />
<FeaturedSuppliers />
<QuickJobs />
<Statistics />
<Testimonials />
<HomeCta />
<HowItWorks />
<TrustSafety />

    </div>
  );
}