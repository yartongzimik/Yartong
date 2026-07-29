import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const shortcuts = [
  ["Materials", "Buy quality materials", ROUTES.materials],
  ["Trades & Services", "Find skilled professionals", ROUTES.trades],
  ["Yartong Workforce", "Hire local labourers", ROUTES.workers],
] as const;

export function Hero() {
  return (
    <section className="px-4 pt-4 sm:px-5 sm:pt-5">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12091d] shadow-2xl shadow-black/25">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,13,0.96)_0%,rgba(7,5,13,0.88)_38%,rgba(7,5,13,0.55)_68%,rgba(7,5,13,0.9)_100%),radial-gradient(circle_at_68%_44%,rgba(245,158,11,0.22),transparent_20%),radial-gradient(circle_at_58%_28%,rgba(155,77,255,0.34),transparent_32%)]" />
        <div className="absolute inset-y-0 right-[24%] hidden w-px bg-white/10 lg:block" />
        <div className="relative grid min-h-[365px] lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-9">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/80">Senapati&apos;s construction marketplace</p>
              <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Senapati&apos;s most <span className="text-fuchsia-300">trusted</span><br />construction marketplace.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/68 sm:text-lg">Find materials, skilled services, contractors and reliable workforce in one local marketplace.</p>
            </div>

            <div className="mt-8 grid overflow-hidden rounded-2xl border border-white/12 bg-white/95 text-slate-900 sm:grid-cols-3">
              {shortcuts.map(([title, detail, href], index) => (
                <Link key={title} href={href} className={`group px-5 py-4 transition hover:bg-fuchsia-50 ${index ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}`}>
                  <p className="font-black">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  <span className="mt-2 block text-xs font-black text-fuchsia-700 opacity-0 transition group-hover:opacity-100">Explore →</span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="m-4 rounded-2xl border border-white/12 bg-[#0d1020]/90 p-5 backdrop-blur sm:m-6 lg:my-6 lg:ml-0" aria-label="Marketplace intent search">
            <h2 className="text-xl font-black text-white">What do you need?</h2>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              <label className="flex items-center gap-2"><input type="radio" name="intent" defaultChecked /> I want to buy</label>
              <label className="flex items-center gap-2"><input type="radio" name="intent" /> I want a service</label>
              <label className="flex items-center gap-2"><input type="radio" name="intent" /> I need workforce</label>
            </div>
            <input className="mt-5 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" placeholder="Search materials, services..." />
            <Link href={ROUTES.postJob} className="mt-3 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#9B4DFF] to-[#E126FF] px-4 py-3 text-sm font-black text-white">Request a quote</Link>
            <p className="mt-2 text-center text-[11px] text-white/45">Free to post. Compare local options.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}