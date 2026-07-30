import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const promotedProviders = [
  ["ABC Fabrication Works","4.8","128","Advanced"],
  ["K & Sons Electrical","4.7","96","Standard"],
  ["Senapati Plumbing Services","4.6","84","Standard"],
  ["Elite Interior & Design","4.9","64","Advanced"],
] as const;

export function AdvertisingRail() {
  return <aside className="hidden min-w-0 space-y-3 xl:block" aria-label="Sponsored and promoted marketplace content">
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-3 py-1 text-center text-[10px] uppercase text-slate-500">Advertisement</div>
      <div className="relative min-h-[255px] overflow-hidden bg-[#0b3159] p-5 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{backgroundImage:"url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80)"}} />
        <div className="relative"><span className="rounded bg-[#0b1b36] px-2 py-1 text-[10px] font-black">FEATURED</span><h2 className="mt-4 text-3xl font-black leading-tight">Build Strong.<br/>Build Better.</h2><p className="mt-3 max-w-[14rem] text-sm leading-6 text-white/90">Premium Cement for Stronger Structures</p><Link href={ROUTES.materials} className="mt-4 inline-flex rounded-lg bg-[#0b1b36] px-4 py-2 text-xs font-black">Shop Now</Link></div>
      </div>
    </section>
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-sm font-black">Top Rated Providers</h2><Link href={ROUTES.workers} className="text-xs font-bold text-[#0b376f]">View all</Link></div>
      <div className="mt-3 divide-y divide-slate-100">{promotedProviders.map(([name,rating,reviews,tier])=><Link key={name} href={ROUTES.workers} className="flex items-center gap-3 py-3"><div className="grid h-12 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-slate-200 to-amber-100 text-xs font-black text-slate-500">{name.slice(0,2)}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{name}</p><p className="mt-1 text-[10px] text-amber-400">★★★★★ <span className="text-slate-600">{rating} ({reviews} reviews)</span></p></div><span className="rounded bg-[#0b1b36] px-2 py-1 text-[9px] font-bold text-white">{tier}</span></Link>)}</div>
    </section>
    <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#0b3159] p-5 text-white shadow-sm"><div className="absolute -right-12 top-8 h-40 w-40 rounded-full border-[20px] border-amber-400/20"/><div className="relative"><p className="text-[10px] uppercase text-white/65">Advertisement</p><h2 className="mt-4 text-2xl font-black">Grow Your Business<br/><span className="text-amber-400">Advertise with Yartong</span></h2><ul className="mt-4 space-y-2 text-sm"><li>✓ Reach more customers</li><li>✓ Boost your brand</li><li>✓ Get more enquiries</li></ul><Link href={ROUTES.advertise} className="mt-6 inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-black text-slate-950">Advertise Now</Link></div></section>
  </aside>;
}