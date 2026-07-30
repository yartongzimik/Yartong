import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const shortcuts = [
  ["▦", "Materials", "Buy quality materials", ROUTES.materials],
  ["⚒", "Trades & Services", "Find skilled professionals", ROUTES.trades],
  ["♙", "Yartong Workforce", "Hire managed labourers", ROUTES.workers],
] as const;

export function Hero() {
  return (
    <section className="relative min-h-[390px] overflow-hidden bg-[#0b1b36] text-white shadow-sm">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(90deg,rgba(6,20,42,.96) 0%,rgba(6,20,42,.75) 45%,rgba(6,20,42,.28) 72%,rgba(6,20,42,.72) 100%),url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=85)" }} />
      <div className="relative grid min-h-[390px] lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl">Senapati&apos;s Most <span className="text-amber-400">Trusted</span><br />Construction Marketplace</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">Find quality materials, skilled services and reliable workforce — all in one place.</p>
          </div>
          <div className="mt-8 grid overflow-hidden rounded-xl border border-white/40 bg-white/95 text-slate-950 shadow-xl sm:grid-cols-3">
            {shortcuts.map(([icon, title, detail, href], index) => <Link key={title} href={href} className={`flex items-center gap-3 px-5 py-4 transition hover:bg-amber-50 ${index ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}`}><span className="text-3xl text-[#0b1b36]">{icon}</span><span><strong className="block text-sm">{title}</strong><small className="mt-1 block text-xs text-slate-500">{detail}</small></span></Link>)}
          </div>
        </div>
        <aside className="m-5 self-center rounded-xl border border-white/15 bg-[#081a35]/92 p-5 shadow-2xl backdrop-blur-md lg:ml-0" aria-label="Marketplace request form">
          <h2 className="text-xl font-black">What do you need?</h2>
          <div className="mt-4 space-y-2 text-sm">
            <label className="flex items-center gap-2"><input className="accent-amber-400" type="radio" name="intent" defaultChecked /> I want to Buy</label>
            <label className="flex items-center gap-2"><input className="accent-amber-400" type="radio" name="intent" /> I want a Service</label>
            <label className="flex items-center gap-2"><input className="accent-amber-400" type="radio" name="intent" /> I need Workforce</label>
          </div>
          <input className="mt-5 w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" placeholder="Search materials, services..." />
          <Link href={ROUTES.postJob} className="mt-3 flex w-full items-center justify-center rounded-lg bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 shadow-sm">Request a Quote</Link>
          <p className="mt-2 text-center text-[11px] text-white/80">It&apos;s free and only takes a minute!</p>
        </aside>
      </div>
    </section>
  );
}