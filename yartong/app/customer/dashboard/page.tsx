import Link from "next/link";
import { PaymentStatus } from "@prisma/client";

import { requireUser } from "@/lib/authz";
import { getCustomerDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100); }
function Sparkline({ values }: { values: number[] }) { const max = Math.max(...values, 1); const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${28 - (value / max) * 22}`).join(" "); return <svg viewBox="0 0 100 30" className="mt-2 h-7 w-full" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" points={points} /></svg>; }

export default async function CustomerDashboardPage() {
  const user = await requireUser();
  const [dashboard, profile, materialOrders, paidSpend, paidCount, reviewsWritten, activePayments, recentOrders] = await Promise.all([
    getCustomerDashboard(user.id),
    prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { displayName: true, image: true, phoneNumber: true, verificationStatus: true, createdAt: true, primaryLocation: { select: { name: true, state: true } }, customerProfile: { select: { bio: true } } } }),
    prisma.materialOrder.count({ where: { customerId: user.id } }),
    prisma.paymentOrder.aggregate({ where: { customerId: user.id, status: PaymentStatus.SUCCEEDED }, _sum: { amount: true } }),
    prisma.paymentOrder.count({ where: { customerId: user.id, status: PaymentStatus.SUCCEEDED } }),
    prisma.review.count({ where: { authorId: user.id } }),
    prisma.paymentOrder.count({ where: { customerId: user.id, status: { in: [PaymentStatus.CREATED, PaymentStatus.PENDING, PaymentStatus.REQUIRES_ACTION, PaymentStatus.PROCESSING] } } }),
    prisma.materialOrder.findMany({ where: { customerId: user.id }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, orderNumber: true, status: true, subtotal: true, supplier: { select: { displayName: true, materialSupplierProfile: { select: { businessName: true } } } } } }),
  ]);
  const location = profile.primaryLocation;
  const totalSpend = paidSpend._sum.amount ?? 0;
  const totalEngagements = dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements;
  const verificationPoints = profile.verificationStatus === "UNVERIFIED" ? 10 : 35;
  const activityPoints = Math.min(35, dashboard.metrics.publishedJobs * 2 + totalEngagements * 4 + reviewsWritten);
  const profilePoints = profile.phoneNumber && location ? 30 : profile.phoneNumber || location ? 20 : 10;
  const healthScore = Math.min(100, verificationPoints + activityPoints + profilePoints);
  const stats = [
    ["Total Spend", money(totalSpend), [1,2,2,3,4,Math.max(paidCount,1)], "text-cyan-600"],
    ["Projects Posted", dashboard.metrics.publishedJobs, [1,1,2,2,3,Math.max(dashboard.metrics.publishedJobs,1)], "text-violet-600"],
    ["Active Projects", dashboard.metrics.activeEngagements, [0,1,1,2,2,Math.max(dashboard.metrics.activeEngagements,1)], "text-emerald-600"],
    ["Completed Jobs", dashboard.metrics.completedEngagements, [0,1,2,3,4,Math.max(dashboard.metrics.completedEngagements,1)], "text-blue-600"],
    ["Material Orders", materialOrders, [0,0,1,1,2,Math.max(materialOrders,1)], "text-amber-600"],
    ["Unread Messages", dashboard.metrics.unreadMessages, [1,2,1,3,2,Math.max(dashboard.metrics.unreadMessages,1)], "text-fuchsia-600"],
  ] as const;
  const orderValues = recentOrders.length ? recentOrders.slice().reverse().map((order) => order.subtotal) : [0,0,0,0,0];

  return <CustomerWorkspaceShell active="Dashboard" title="Dashboard" subtitle="Welcome back. Here is your marketplace activity overview." actions={<><Link href="/post-job" className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-black text-white">+ Post Project</Link><Link href="/workers" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black">Find Providers</Link></>}>
    <section className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_350px]">
      <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-sm backdrop-blur-xl"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-violet-100 font-black text-violet-700">{profile.image ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.image})` }} /> : (profile.displayName || "C").slice(0,1)}</div><div><div className="flex items-center gap-2"><h2 className="text-xl font-black">{profile.displayName || "Customer"}</h2><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">Verified</span></div><p className="text-xs text-slate-500">Customer · {location ? `${location.name}, ${location.state}` : "Location not set"}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Phone", profile.phoneNumber ? "Verified" : "Missing"], ["Profile", profile.customerProfile ? "Active" : "Incomplete"], ["Location", location ? "Verified" : "Missing"], ["Member since", profile.createdAt.toLocaleDateString("en-IN", { month: "short", year: "numeric" })]].map(([label,value]) => <div key={label} className="rounded-xl bg-slate-50 p-2.5"><p className="text-[9px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-xs font-black">{value}</p></div>)}</div></div>
      <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-sm backdrop-blur-xl"><div className="flex justify-between"><h2 className="text-sm font-black">Account Health Score</h2><span className="text-[10px] text-slate-400">Live</span></div><div className="mt-3 flex items-center gap-4"><div className="grid h-24 w-24 place-items-center rounded-full border-[10px] border-violet-500 bg-white"><div className="text-center"><p className="text-2xl font-black">{healthScore}</p><p className="text-[9px] font-black text-emerald-600">{healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Building"}</p></div></div><div className="flex-1 space-y-2 text-[10px]"><div className="flex justify-between"><span>Profile</span><b>{profilePoints}/30</b></div><div className="flex justify-between"><span>Verification</span><b>{verificationPoints}/35</b></div><div className="flex justify-between"><span>Activity</span><b>{activityPoints}/35</b></div><div className="flex justify-between"><span>Payment actions</span><b>{activePayments}</b></div></div></div></div>
    </section>
    <section className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">{stats.map(([label,value,values,tone]) => <div key={label} className={`rounded-xl border border-white/80 bg-white/94 p-3 shadow-sm ${tone}`}><p className="text-[9px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-xl font-black text-slate-950">{value}</p><Sparkline values={[...values]} /></div>)}</section>
    <section className="mt-3 grid gap-3 xl:grid-cols-[1.3fr_.8fr_.8fr]">
      <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-sm"><div className="flex justify-between"><div><h2 className="text-sm font-black">Spending Overview</h2><p className="text-[10px] text-slate-400">Recent material transactions</p></div><b>{money(recentOrders.reduce((sum, order) => sum + order.subtotal, 0))}</b></div><div className="mt-4 flex h-32 items-end gap-2 rounded-xl bg-slate-50 p-3">{orderValues.map((value,index) => { const max = Math.max(...orderValues,1); return <div key={index} className="flex h-full flex-1 items-end"><div className="w-full rounded-t bg-gradient-to-t from-violet-600 to-fuchsia-400" style={{ height: `${Math.max(8,(value/max)*100)}%` }} /></div>; })}</div></div>
      <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-sm"><h2 className="text-sm font-black">Category Breakdown</h2><div className="mt-4 grid place-items-center"><div className="grid h-28 w-28 place-items-center rounded-full border-[18px] border-violet-500 bg-white"><div className="text-center"><p className="text-lg font-black">{money(totalSpend)}</p><p className="text-[9px] text-slate-400">TOTAL</p></div></div></div><div className="mt-3 space-y-1 text-[10px]"><div className="flex justify-between"><span>Labour & Work</span><b>{totalEngagements}</b></div><div className="flex justify-between"><span>Materials</span><b>{materialOrders}</b></div><div className="flex justify-between"><span>Reviews</span><b>{reviewsWritten}</b></div></div></div>
      <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-sm"><h2 className="text-sm font-black">Activity Heatmap</h2><div className="mt-4 grid grid-cols-7 gap-1.5">{Array.from({ length: 35 }, (_,index) => <span key={index} className={`aspect-square rounded-sm ${["bg-violet-50","bg-violet-100","bg-violet-200","bg-violet-400","bg-violet-600"][(index + dashboard.metrics.publishedJobs + totalEngagements) % 5]}`} />)}</div><div className="mt-3 flex justify-between text-[9px] font-bold text-slate-400"><span>Less activity</span><span>More activity</span></div></div>
    </section>
    <section className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_.9fr]"><div className="rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="flex justify-between border-b border-slate-200 px-4 py-3"><h2 className="text-sm font-black">Recent Activity</h2><Link href="/customer/projects" className="text-xs font-black text-violet-700">View all →</Link></div><div className="divide-y divide-slate-100">{dashboard.activities.slice(0,5).map((activity) => <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_140px_20px]"><div><p className="text-xs font-black">{activity.title}</p><p className="text-[10px] text-slate-400">Marketplace activity</p></div><p className="text-[10px] font-bold text-slate-500">{activity.meta}</p><span className="text-violet-600">→</span></Link>)}</div></div><div className="rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="border-b border-slate-200 px-4 py-3"><h2 className="text-sm font-black">Recent Orders</h2></div>{recentOrders.length ? <div className="divide-y divide-slate-100">{recentOrders.map((order) => <div key={order.id} className="flex justify-between gap-3 px-4 py-3"><div><p className="text-xs font-black">{order.supplier.materialSupplierProfile?.businessName || order.supplier.displayName || "Supplier"}</p><p className="text-[10px] text-slate-400">{order.orderNumber} · {order.status.replaceAll("_", " ")}</p></div><b className="text-xs">{money(order.subtotal)}</b></div>)}</div> : <p className="p-4 text-xs text-slate-500">No material orders yet.</p>}</div></section>
  </CustomerWorkspaceShell>;
}
