import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const categories = [["Cement","▣"],["Steel","≡"],["Bricks","▦"],["Sand","△"],["Paint","▤"],["Plumbing","⌁"],["Electrical","ϟ"],["Hardware","⚒"],["Roofing","⌂"],["Tiles","◇"]] as const;
const filters = ["All Trades","Masonry","Carpentry","Electrical","Plumbing","Fabrication","Painting","Roofing"] as const;
const providers = [
  { name:"ABC Fabrication Works", trade:"Fabrication · Gates, Railings, Roofing", rating:"4.8", reviews:"128", tier:"Advanced", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" },
  { name:"K & Sons Electrical", trade:"Electrical · Wiring, Installation, Maintenance", rating:"4.7", reviews:"96", tier:"Standard", image:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" },
  { name:"Senapati Plumbing Services", trade:"Plumbing · Installation, Repair, Maintenance", rating:"4.6", reviews:"84", tier:"Standard", image:"https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80" },
  { name:"Elite Interior & Design", trade:"Interior · Design, POP, Modular Kitchen", rating:"4.9", reviews:"64", tier:"Advanced", image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
] as const;
const trust = [["⬡","Verified & Trusted","All providers are verified by Yartong"],["✪","Quality Guaranteed","Better quality, better experience"],["♙","Managed Workforce","Trained, reliable & managed by Yartong"],["◉","Support 24/7","We’re here to help you anytime"]] as const;

export function MarketplaceShowcase() {
  return <section className="bg-white px-5 pb-8 pt-6 text-slate-950">
    <div className="flex items-center justify-between"><h2 className="text-lg font-black">Popular Categories</h2><Link href={ROUTES.materials} className="text-xs font-bold text-[#0b376f]">View all categories</Link></div>
    <p className="mt-4 text-[10px] font-bold uppercase text-slate-500">Materials</p>
    <div className="mt-2 grid grid-cols-5 gap-3 md:grid-cols-10">{categories.map(([label,icon],index)=><Link key={label} href={index>4?ROUTES.workers:ROUTES.materials} className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-amber-50 px-2 shadow-sm transition hover:-translate-y-0.5"><span className="text-3xl text-slate-800">{icon}</span><span className="mt-2 text-xs font-semibold">{label}</span></Link>)}</div>
    <div className="mt-7 flex items-center justify-between"><h2 className="text-lg font-black">Top Service Providers</h2><Link href={ROUTES.workers} className="text-xs font-bold text-[#0b376f]">View all</Link></div>
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map((item,index)=><span key={item} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${index===0?"border-[#0b1b36] bg-[#0b1b36] text-white":"border-slate-200 bg-slate-50 text-slate-700"}`}>{item}</span>)}</div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{providers.map(provider=><Link key={provider.name} href={ROUTES.workers} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative h-36 bg-cover bg-center" style={{backgroundImage:`url(${provider.image})`}}><span className="absolute left-2 top-2 rounded bg-[#0b1b36] px-2 py-1 text-[10px] font-bold text-white">{provider.tier}</span></div><div className="p-3"><h3 className="text-sm font-black">{provider.name}</h3><p className="mt-1 text-[11px] text-slate-600">{provider.trade}</p><div className="mt-3 flex items-center justify-between text-[11px]"><span className="font-black text-amber-400">★★★★★ <b className="text-slate-700">{provider.rating}</b> <span className="font-normal text-slate-500">({provider.reviews})</span></span><span className="text-slate-500">⌖ Senapati Town</span></div></div></Link>)}</div>
    <div className="mt-6 grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-4">{trust.map(([icon,title,detail],index)=><div key={title} className={`flex items-center gap-4 p-5 ${index?"border-t border-slate-200 sm:border-l sm:border-t-0":""}`}><span className="grid h-12 w-12 place-items-center text-3xl text-emerald-600">{icon}</span><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p></div></div>)}</div>
  </section>;
}