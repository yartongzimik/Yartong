import Link from "next/link";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100); }

export default async function CustomerSavedPage() {
  await requireUser();
  const [materials, providers] = await Promise.all([
    prisma.supplierListing.findMany({ where: { status: "ACTIVE" }, orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, title: true, price: true, variant: { select: { product: { select: { category: { select: { name: true } } } } } } } }),
    prisma.user.findMany({ where: { primaryRole: { in: ["SKILLED_PROVIDER", "LABOURER", "CONTRACTOR"] }, accountStatus: "ACTIVE" }, orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, displayName: true, primaryRole: true, image: true, verificationStatus: true } }),
  ]);
  return <CustomerWorkspaceShell active="Saved Items" title="Saved Items" subtitle="Keep useful materials and professionals in one shortlist.">
    <section className="rounded-2xl border border-white/80 bg-white/94 p-3 shadow-sm"><div className="flex gap-2 text-[10px] font-black"><span className="rounded-lg bg-violet-600 px-3 py-1.5 text-white">All</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Materials ({materials.length})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Providers ({providers.length})</span></div></section>
    <section className="mt-3 grid gap-3 lg:grid-cols-2"><div className="rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="border-b border-slate-200 p-3"><h2 className="text-sm font-black">Saved materials</h2></div><div className="divide-y divide-slate-100">{materials.map((item) => <div key={item.id} className="flex items-center gap-3 p-3"><div className="grid h-12 w-12 place-items-center rounded-lg bg-amber-50 text-xs font-black text-amber-700">{item.variant.product.category.name.slice(0,2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{item.title}</p><p className="text-[10px] text-slate-400">{item.variant.product.category.name} · {money(item.price)}</p></div><button type="button" className="rounded-lg border border-violet-200 px-2 py-1 text-[10px] font-black text-violet-700">Order</button><button type="button" className="text-rose-500">×</button></div>)}</div><Link href="/customer/materials" className="block border-t border-slate-200 p-3 text-center text-[10px] font-black text-violet-700">View all materials →</Link></div><div className="rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="border-b border-slate-200 p-3"><h2 className="text-sm font-black">Saved professionals</h2></div><div className="divide-y divide-slate-100">{providers.map((provider) => <div key={provider.id} className="flex items-center gap-3 p-3"><div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-slate-100 text-xs font-black">{provider.image ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${provider.image})` }} /> : (provider.displayName || "P").slice(0,1)}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{provider.displayName || "Yartong professional"}</p><p className="text-[10px] text-slate-400">{provider.primaryRole.replaceAll("_", " ")} · {provider.verificationStatus.replaceAll("_", " ")}</p></div><Link href={`/providers/${provider.id}`} className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black">View</Link><button type="button" className="text-rose-500">×</button></div>)}</div><Link href="/workers" className="block border-t border-slate-200 p-3 text-center text-[10px] font-black text-violet-700">Find more professionals →</Link></div></section>
  </CustomerWorkspaceShell>;
}
