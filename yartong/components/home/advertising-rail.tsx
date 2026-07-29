import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const promotedProviders = [
  { name: "Demo Mason", detail: "Masonry · Repairs", rating: "4.9" },
  { name: "Demo Electrician", detail: "Electrical · Wiring", rating: "4.8" },
  { name: "Demo Valley Contractor", detail: "Renovation · Construction", rating: "4.7" },
] as const;

export function AdvertisingRail() {
  return (
    <aside className="hidden min-w-0 space-y-5 xl:block" aria-label="Sponsored and promoted marketplace content">
      <section className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a] shadow-xl shadow-black/25">
        <div className="border-b border-white/10 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Advertisement</div>
        <div className="relative min-h-[310px] overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,158,11,0.38),transparent_32%),linear-gradient(145deg,#0d2341,#07101f)]" />
          <div className="relative flex h-full min-h-[260px] flex-col justify-between">
            <div>
              <span className="inline-flex rounded-md bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">Featured</span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-white">Build strong. Sell locally.</h2>
              <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/70">Premium homepage placement for verified material brands and local businesses.</p>
            </div>
            <Link href={ROUTES.advertise} className="mt-6 inline-flex w-fit rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300">Promote your business</Link>
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-black text-white">Promoted providers</h2>
          <Link href={ROUTES.workers} className="text-xs font-bold text-fuchsia-200">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-white/10">
          {promotedProviders.map((provider) => (
            <Link key={provider.name} href={ROUTES.workers} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400/25 to-violet-400/10 text-sm font-black text-fuchsia-100">{provider.name.charAt(5) || provider.name.charAt(0)}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-white">{provider.name}</p>
                <p className="mt-0.5 truncate text-xs text-white/45">{provider.detail}</p>
              </div>
              <span className="text-xs font-bold text-amber-300">★ {provider.rating}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-[#1d0c34] via-[#120b20] to-[#090610] p-6 shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Advertisement</p>
        <h2 className="mt-5 text-2xl font-black text-white">Grow your business on Yartong</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/65">
          <li>✓ Reach nearby customers</li>
          <li>✓ Promote products and services</li>
          <li>✓ Feature your verified profile</li>
        </ul>
        <Link href={ROUTES.advertise} className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-5 py-3 text-sm font-black text-white">Advertise now</Link>
      </section>
    </aside>
  );
}
