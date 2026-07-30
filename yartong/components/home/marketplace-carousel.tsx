"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ROUTES } from "@/lib/constants";

type Item = { name: string; detail: string; image: string; rating?: string; reviews?: string; tier?: string; price?: string; href: string };

function InfiniteRow({ items, compact = false }: { items: Item[]; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const loop = [...items, ...items, ...items];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    requestAnimationFrame(() => { node.scrollLeft = node.scrollWidth / 3; });
    const onScroll = () => {
      const third = node.scrollWidth / 3;
      if (node.scrollLeft < third * 0.25) node.scrollLeft += third;
      if (node.scrollLeft > third * 1.75) node.scrollLeft -= third;
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  const move = (direction: number) => ref.current?.scrollBy({ left: direction * Math.max(240, (ref.current?.clientWidth ?? 600) * 0.72), behavior: "smooth" });

  return <div className="relative">
    <button type="button" aria-label="Scroll left" onClick={() => move(-1)} className="absolute -left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-lg font-black text-slate-700 shadow-md active:scale-95 sm:grid">‹</button>
    <div ref={ref} className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-0.5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {loop.map((item, index) => <Link key={`${item.name}-${index}`} href={item.href} className={`${compact ? "w-[164px] sm:w-[190px] lg:w-[205px]" : "w-[190px] sm:w-[220px] lg:w-[235px] xl:w-[250px]"} shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]`}>
        <div className={`${compact ? "h-24 sm:h-28" : "h-28 sm:h-32"} relative bg-cover bg-center`} style={{ backgroundImage: `url(${item.image})` }}>{item.tier ? <span className="absolute left-2 top-2 rounded-md bg-[#0b1b36]/95 px-2 py-1 text-[9px] font-black text-white">{item.tier}</span> : null}</div>
        <div className="p-2.5 sm:p-3"><h3 className="truncate text-xs font-black text-slate-950 sm:text-sm">{item.name}</h3><p className="mt-1 line-clamp-2 min-h-7 text-[10px] leading-3.5 text-slate-600 sm:text-[11px]">{item.detail}</p><div className="mt-2.5 flex items-center justify-between gap-1 text-[9px] sm:text-[10px]"><span className="truncate font-black text-amber-500">{item.rating ? `★★★★★ ${item.rating} (${item.reviews})` : item.price}</span><span className="shrink-0 text-slate-500">⌖ Senapati</span></div></div>
      </Link>)}
    </div>
    <button type="button" aria-label="Scroll right" onClick={() => move(1)} className="absolute -right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#0b1b36] text-lg font-black text-white shadow-md active:scale-95 sm:grid">›</button>
  </div>;
}

const trades: Item[] = [
  { name: "ABC Fabrication Works", detail: "Fabrication · Gates, railings and roofing", rating: "4.8", reviews: "128", tier: "Advanced", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=82", href: ROUTES.workers },
  { name: "K & Sons Electrical", detail: "Electrical · Wiring, installation and maintenance", rating: "4.7", reviews: "96", tier: "Standard", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=82", href: ROUTES.workers },
  { name: "Senapati Plumbing Services", detail: "Plumbing · Installation, repair and maintenance", rating: "4.6", reviews: "84", tier: "Standard", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=82", href: ROUTES.workers },
  { name: "Elite Interior & Design", detail: "Interior · Design, POP and modular kitchens", rating: "4.9", reviews: "64", tier: "Advanced", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=82", href: ROUTES.workers },
];
const suppliers: Item[] = [
  { name: "BuildWell Cement Store", detail: "Cement · OPC, PPC and PSC", rating: "4.7", reviews: "112", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=82", href: ROUTES.materials },
  { name: "Northeast Steel Traders", detail: "Steel · TMT bars, rods and angles", rating: "4.6", reviews: "97", image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=900&q=82", href: ROUTES.materials },
  { name: "Senapati Bricks Supplier", detail: "Bricks · Red and fly-ash bricks", rating: "4.5", reviews: "86", image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=900&q=82", href: ROUTES.materials },
  { name: "Senapati Sand Depot", detail: "Sand · River sand and M-sand", rating: "4.8", reviews: "76", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=82", href: ROUTES.materials },
];
const products: Item[] = [
  { name: "Cement (50kg)", detail: "Compare local sellers and delivery", price: "From ₹390/bag", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80", href: ROUTES.materials },
  { name: "TMT Steel (12mm)", detail: "Verified stock and current quotes", price: "From ₹58/kg", image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=700&q=80", href: ROUTES.materials },
  { name: "Red Bricks", detail: "Seller comparison by distance", price: "From ₹5,500/load", image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=700&q=80", href: ROUTES.materials },
  { name: "River Sand", detail: "Delivery and quantity options", price: "From ₹1,200/ton", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80", href: ROUTES.materials },
];
const services: Item[] = [
  { name: "Roofing Works", detail: "Find providers for installation and repair", image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=800&q=82", href: ROUTES.workers },
  { name: "Plumbing Works", detail: "Pipelines, fittings and repairs", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=82", href: ROUTES.workers },
  { name: "Interior Design", detail: "Home, office and renovation", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=82", href: ROUTES.workers },
  { name: "Painting Works", detail: "Interior, exterior and textures", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=82", href: ROUTES.workers },
];

function Heading({ title, href, label }: { title: string; href: string; label: string }) { return <div className="mb-2.5 mt-5 flex items-center justify-between gap-3 sm:mt-6"><h2 className="text-base font-black text-slate-950 sm:text-lg">{title}</h2><Link href={href} className="shrink-0 text-[10px] font-black text-[#0b376f] sm:text-xs">{label} →</Link></div>; }

export function MarketplaceCarousel() {
  return <section className="bg-white px-3 pb-7 pt-1 text-slate-950 sm:px-5 lg:px-6">
    <Heading title="Top Rated Trades & Services" href={ROUTES.workers} label="View all trades" /><InfiniteRow items={trades} />
    <Heading title="Top Rated Material Providers" href={ROUTES.materials} label="View all providers" /><InfiniteRow items={suppliers} />
    <Heading title="Popular Materials" href={ROUTES.materials} label="View all materials" /><InfiniteRow items={products} compact />
    <Heading title="Popular Services Showcase" href={ROUTES.workers} label="View all services" /><InfiniteRow items={services} compact />
    <div className="mt-5 grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm sm:grid-cols-2 xl:grid-cols-4">{[["⬡","Quality Assured","Quality across products and services"],["♙","Managed Workforce","Skilled and reliable local workers"],["▣","Secure Transactions","Payment features activate in a later phase"],["◉","24/7 Support","Platform help when you need it"]].map(([icon,title,detail],i)=><div key={title} className={`flex items-center gap-3 p-3.5 ${i?"border-t border-slate-200 sm:border-l sm:border-t-0":""}`}><span className="text-xl text-[#0b376f]">{icon}</span><div><p className="text-xs font-black sm:text-sm">{title}</p><p className="mt-0.5 text-[10px] text-slate-600 sm:text-[11px]">{detail}</p></div></div>)}</div>
  </section>;
}
