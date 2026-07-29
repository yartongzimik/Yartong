import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100); }

export default async function CustomerOrdersPage() {
  const user = await requireUser();
  const orders = await prisma.materialOrder.findMany({ where: { customerId: user.id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, orderNumber: true, status: true, subtotal: true, createdAt: true, supplier: { select: { displayName: true, materialSupplierProfile: { select: { businessName: true } } } } } });
  const spent = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const fulfilled = orders.filter((order) => order.status === "FULFILLED").length;
  const pending = orders.length - fulfilled;
  return <CustomerWorkspaceShell active="Orders" title="Orders" subtitle="Track and manage your material orders.">
    <section className="grid grid-cols-2 gap-2 md:grid-cols-4">{[["Total orders", orders.length], ["Total spent", money(spent)], ["Pending", pending], ["Fulfilled", fulfilled]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/80 bg-white/94 p-3 shadow-sm"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>)}</section>
    <section className="mt-3 overflow-hidden rounded-2xl border border-white/80 bg-white/94 shadow-sm backdrop-blur-xl"><div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3 text-[10px] font-black"><span className="rounded-lg bg-violet-600 px-3 py-1.5 text-white">All ({orders.length})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Pending ({pending})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Fulfilled ({fulfilled})</span></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase text-slate-400"><tr><th className="px-4 py-3">Order</th><th>Supplier</th><th>Status</th><th>Amount</th><th>Date</th><th className="pr-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{orders.map((order) => <tr key={order.id}><td className="px-4 py-3 font-black">{order.orderNumber}</td><td>{order.supplier.materialSupplierProfile?.businessName || order.supplier.displayName || "Supplier"}</td><td><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">{order.status.replaceAll("_", " ")}</span></td><td className="font-black">{money(order.subtotal)}</td><td>{order.createdAt.toLocaleDateString("en-IN")}</td><td className="pr-4 text-right"><button type="button" className="rounded-lg border border-violet-200 px-2 py-1 text-[10px] font-black text-violet-700">View</button></td></tr>)}{!orders.length ? <tr><td colSpan={6} className="p-5 text-center text-slate-500">No material orders yet.</td></tr> : null}</tbody></table></div></section>
  </CustomerWorkspaceShell>;
}
