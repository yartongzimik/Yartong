import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const categories = [
  ["Cement", "▣", ROUTES.materials],
  ["Steel", "≡", ROUTES.materials],
  ["Bricks", "▦", ROUTES.materials],
  ["Sand", "△", ROUTES.materials],
  ["Paint", "▤", ROUTES.materials],
  ["Plumbing", "⌁", ROUTES.workers],
  ["Electrical", "ϟ", ROUTES.workers],
  ["Hardware", "⚒", ROUTES.materials],
  ["Roofing", "⌂", ROUTES.trades],
  ["Tiles", "◇", ROUTES.materials],
] as const;

const providers = [
  { name: "Demo Mason Works", trade: "Masonry · Repair · Finishing", rating: "4.9", reviews: "128", tier: "Advanced", icon: "MW" },
  { name: "Demo Electrician", trade: "Electrical · Wiring · Installation", rating: "4.8", reviews: "96", tier: "Standard", icon: "DE" },
  { name: "Demo Plumbing Services", trade: "Plumbing · Repair · Maintenance", rating: "4.7", reviews: "84", tier: "Standard", icon: "DP" },
  { name: "Demo Valley Contractor", trade: "Renovation · Construction", rating: "4.9", reviews: "64", tier: "Advanced", icon: "VC" },
] as const;

const tradeFilters = ["All Trades", "Masonry", "Carpentry", "Electrical", "Plumbing", "Fabrication", "Painting", "Roofing"] as const;

const trust = [
  ["✓", "Verified & Trusted", "Provider verification and ratings"],
  ["★", "Quality Signals", "Reviews, experience and activity"],
  ["◌", "Local Workforce", "Workers and teams around Senapati"],
  ["◉", "Platform Support", "Messages, jobs and account tools"],
] as const;

export function MarketplaceShowcase() {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-5">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-white">Popular categories</h2>
          <Link href={ROUTES.materials} className="text-xs font-bold text-fuchsia-200">View all categories</Link>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 md:grid-cols-10">
          {categories.map(([label, icon, href]) => (
            <Link key={label} href={href} className="group flex min-h-24 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-2 text-center transition hover:border-fuchsia-200/30 hover:bg-fuchsia-300/10">
              <span className="text-2xl text-fuchsia-200 transition group-hover:scale-110">{icon}</span>
              <span className="mt-2 text-[11px] font-bold text-white/75">{label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-white">Top service providers</h2>
          <Link href={ROUTES.workers} className="text-xs font-bold text-fuchsia-200">View all</Link>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {tradeFilters.map((filter, index) => (
            <span key={filter} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${index === 0 ? "border-fuchsia-200/30 bg-fuchsia-300/15 text-fuchsia-100" : "border-white/10 bg-white/[0.04] text-white/55"}`}>{filter}</span>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {providers.map((provider, index) => (
            <Link key={provider.name} href={ROUTES.workers} className="overflow-hidden rounded-2xl border border-white/10 bg-[#100a18] transition hover:-translate-y-0.5 hover:border-fuchsia-200/30">
              <div className={`relative h-28 bg-[radial-gradient(circle_at_70%_25%,rgba(245,158,11,0.24),transparent_30%),linear-gradient(135deg,rgba(155,77,255,0.25),rgba(13,16,32,0.96))] ${index % 2 ? "bg-[radial-gradient(circle_at_25%_30%,rgba(225,38,255,0.2),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(32,12,45,0.9))]" : ""}`}>
                <span className="absolute left-3 top-3 rounded-md bg-[#0b1020]/85 px-2 py-1 text-[10px] font-black text-white">{provider.tier}</span>
                <div className="grid h-full place-items-center text-3xl font-black tracking-tight text-white/25">{provider.icon}</div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-white">{provider.name}</h3>
                <p className="mt-1 text-xs leading-5 text-white/50">{provider.trade}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-black text-amber-300">★★★★★ <span className="text-white/65">{provider.rating}</span></span>
                  <span className="text-white/40">({provider.reviews})</span>
                </div>
                <p className="mt-2 text-[11px] text-white/40">⌖ Senapati Town</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] sm:grid-cols-2 xl:grid-cols-4">
          {trust.map(([icon, title, detail], index) => (
            <div key={title} className={`flex items-center gap-3 p-4 ${index ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-300/10 font-black text-fuchsia-200">{icon}</div>
              <div>
                <p className="text-sm font-black text-white">{title}</p>
                <p className="mt-1 text-[11px] leading-4 text-white/45">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}