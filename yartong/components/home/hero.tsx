"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";

const slides = [
  { eyebrow: "YARTONG PLATFORM", title: "Everything You Need", accent: "to Build Better", copy: "One platform for materials, skilled professionals, labourers and construction services.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=88", href: ROUTES.materials, cta: "Explore Yartong" },
  { eyebrow: "LOCAL CONNECTIONS", title: "Find Trusted People", accent: "Near Your Project", copy: "Discover local trades, contractors and workforce with clear profiles and marketplace activity.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=88", href: ROUTES.workers, cta: "Find Providers" },
  { eyebrow: "MATERIAL MARKETPLACE", title: "Compare Materials", accent: "Before You Buy", copy: "Browse products, compare suppliers and request local delivery from one clean marketplace.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=88", href: ROUTES.materials, cta: "Browse Materials" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500); return () => window.clearInterval(id); }, []);
  const slide = slides[active];
  const change = (delta: number) => setActive((active + delta + slides.length) % slides.length);
  return <section className="px-4 pt-4 sm:px-5 sm:pt-5">
    <div className="relative min-h-[520px] overflow-hidden rounded-[1.75rem] bg-[#071b34] text-white shadow-xl">
      {slides.map((item, index) => <div key={item.title} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `linear-gradient(90deg,rgba(3,20,42,.98) 0%,rgba(3,20,42,.88) 37%,rgba(3,20,42,.35) 68%,rgba(3,20,42,.18) 100%),url(${item.image})` }} />)}
      <div className="relative flex min-h-[520px] max-w-3xl flex-col justify-center px-7 py-10 sm:px-12 lg:px-16">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">{slide.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">{slide.title}<br /><span className="text-amber-400">{slide.accent}</span></h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/88 sm:text-lg">{slide.copy}</p>
        <Link href={slide.href} className="mt-7 inline-flex w-fit rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-amber-300 active:scale-95">{slide.cta}</Link>
        <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["⬡","Verified & Trusted","Clear provider profiles"],["▱","Wide Selection","Materials and services"],["◉","Fast & Easy","Compare local options"],["✪","Best Value","Transparent marketplace"]].map(([icon,title,detail])=><div key={title} className="border-l border-white/18 pl-3"><div className="text-2xl text-amber-400">{icon}</div><p className="mt-2 text-sm font-black">{title}</p><p className="mt-1 text-[11px] leading-4 text-white/65">{detail}</p></div>)}</div>
      </div>
      <button type="button" aria-label="Previous promotion" onClick={() => change(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-slate-900/45 text-2xl text-white backdrop-blur active:scale-95">‹</button>
      <button type="button" aria-label="Next promotion" onClick={() => change(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-slate-900/45 text-2xl text-white backdrop-blur active:scale-95">›</button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((item,index)=><button key={item.title} type="button" aria-label={`Open promotion ${index+1}`} onClick={()=>setActive(index)} className={`h-2.5 rounded-full transition-all ${index===active?"w-7 bg-amber-400":"w-2.5 bg-white/60"}`} />)}</div>
    </div>
  </section>;
}
