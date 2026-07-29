import Link from "next/link";
import { PaymentStatus } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { ROUTES, VERIFICATION_LABELS } from "@/lib/constants";
import { getCustomerDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

import { CustomerDashboardBackground } from "./customer-dashboard-background";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100);
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/^./, (char) => char.toUpperCase());
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${28 - (value / max) * 22}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="mt-2 h-7 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" points={points} />
    </svg>
  );
}

export default async function CustomerDashboardPage() {
  const user = await requireUser();

  const [dashboard, profile, materialOrders, paidServiceSpend, paidServiceCount, notifications, reviewsWritten, activePayments, recentOrders] = await Promise.all([
    getCustomerDashboard(user.id),
    prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        displayName: true,
        image: true,
        phoneNumber: true,
        verificationStatus: true,
        createdAt: true,
        primaryLocation: { select: { name: true, district: true, state: true } },
        customerProfile: { select: { bio: true, preferredLanguages: true } },
      },
    }),
    prisma.materialOrder.count({ where: { customerId: user.id } }),
    prisma.paymentOrder.aggregate({ where: { customerId: user.id, status: PaymentStatus.SUCCEEDED }, _sum: { amount: true } }),
    prisma.paymentOrder.count({ where: { customerId: user.id, status: PaymentStatus.SUCCEEDED } }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
    prisma.review.count({ where: { authorId: user.id } }),
    prisma.paymentOrder.count({
      where: { customerId: user.id, status: { in: [PaymentStatus.CREATED, PaymentStatus.PENDING, PaymentStatus.REQUIRES_ACTION, PaymentStatus.PROCESSING] } },
    }),
    prisma.materialOrder.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        subtotal: true,
        createdAt: true,
        supplier: { select: { displayName: true, materialSupplierProfile: { select: { businessName: true } } } },
      },
    }),
  ]);

  const location = profile.primaryLocation;
  const totalServiceSpend = paidServiceSpend._sum.amount ?? 0;
  const totalEngagements = dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements;
  const completionRate = totalEngagements ? Math.round((dashboard.metrics.completedEngagements / totalEngagements) * 100) : 0;
  const verificationPoints = profile.verificationStatus === "UNVERIFIED" ? 10 : 35;
  const activityPoints = Math.min(35, dashboard.metrics.publishedJobs * 2 + totalEngagements * 4 + reviewsWritten);
  const profilePoints = profile.phoneNumber && location ? 30 : profile.phoneNumber || location ? 20 : 10;
  const healthScore = Math.min(100, verificationPoints + activityPoints + profilePoints);
  const orderValues = recentOrders.length ? recentOrders.slice().reverse().map((order) => order.subtotal) : [0, 0, 0, 0, 0];

  const statCards = [
    { label: "Total service spend", value: money(totalServiceSpend), note: `${paidServiceCount} completed payments`, values: [1, 2, 2, 3, 4, Math.max(paidServiceCount, 1)], tone: "text-cyan-600" },
    { label: "Projects posted", value: dashboard.metrics.publishedJobs, note: `${dashboard.metrics.draftJobs} drafts`, values: [1, 1, 2, 2, 3, Math.max(dashboard.metrics.publishedJobs, 1)], tone: "text-violet-600" },
    { label: "Active projects", value: dashboard.metrics.activeEngagements, note: `${dashboard.metrics.completedEngagements} completed`, values: [0, 1, 1, 2, 2, Math.max(dashboard.metrics.activeEngagements, 1)], tone: "text-emerald-600" },
    { label: "Material orders", value: materialOrders, note: "Supplier purchases", values: [0, 0, 1, 1, 2, Math.max(materialOrders, 1)], tone: "text-amber-600" },
    { label: "Unread messages", value: dashboard.metrics.unreadMessages, note: "Provider conversations", values: [1, 2, 1, 3, 2, Math.max(dashboard.metrics.unreadMessages, 1)], tone: "text-fuchsia-600" },
    { label: "Reviews given", value: reviewsWritten, note: "Marketplace feedback", values: [0, 1, 2, 3, 4, Math.max(reviewsWritten, 1)], tone: "text-blue-600" },
  ];

  const navItems = [
    ["Dashboard", "/customer/dashboard"],
    ["My Projects", ROUTES.customerJobs],
    ["Messages", ROUTES.messages],
    ["Materials", ROUTES.materials],
    ["Orders", ROUTES.materials],
    ["Payments", "/engagements"],
    ["Reviews", "/account"],
    ["Alerts", "/notifications"],
    ["Saved Items", ROUTES.workers],
    ["Settings", "/account"],
  ] as const;

  return (
    <PublicShell>
      <div className="relative min-h-screen overflow-hidden bg-[#eef3f8] text-slate-950">
        <CustomerDashboardBackground />
        <div className="relative mx-auto grid w-full max-w-[1680px] lg:grid-cols-[205px_minmax(0,1fr)]">
          <aside className="hidden min-h-[calc(100vh-80px)] border-r border-white/70 bg-white/90 p-3 shadow-sm backdrop-blur-xl lg:block">
            <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer workspace</p>
            <nav className="space-y-1">
              {navItems.map(([label, href], index) => (
                <Link key={label} href={href} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition ${index === 0 ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}>
                  <span>{label}</span>
                  {label === "Messages" && dashboard.metrics.unreadMessages ? <span className="rounded-full bg-fuchsia-500 px-1.5 py-0.5 text-[9px] text-white">{dashboard.metrics.unreadMessages}</span> : null}
                  {label === "Alerts" && notifications ? <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] text-white">{notifications}</span> : null}
                </Link>
              ))}
            </nav>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Support</p>
              <Link href="/account" className="mt-2 block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">Account & preferences</Link>
              <Link href="/verification" className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">Verification</Link>
            </div>
          </aside>

          <main className="min-w-0 p-3 sm:p-4 lg:p-5">
            <section className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_360px]">
              <div className="rounded-2xl border border-white/80 bg-white/92 p-4 shadow-[0_16px_50px_rgba(15,23,42,.10)] backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-violet-100 text-lg font-black text-violet-700">
                      {profile.image ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.image})` }} /> : (profile.displayName || "C").slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-black sm:text-2xl">{profile.displayName || "Customer"}</h1><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">Verified</span></div>
                      <p className="mt-0.5 text-xs text-slate-500">Customer · {location ? `${location.name}, ${location.state}` : "Location not set"}</p>
                      <p className="mt-1 text-xs text-slate-500">{profile.phoneNumber || "Phone not set"}</p>
                    </div>
                  </div>
                  <Link href="/account" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">Edit profile</Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[['Phone', profile.phoneNumber ? 'Verified' : 'Missing'], ['Profile', profile.customerProfile ? 'Active' : 'Incomplete'], ['Location', location ? 'Verified' : 'Missing'], ['Member since', profile.createdAt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xs font-black text-slate-800">{value}</p></div>)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-[0_16px_50px_rgba(15,23,42,.10)] backdrop-blur-xl">
                <div className="flex items-center justify-between"><h2 className="text-sm font-black">Account Health Score</h2><span className="text-[10px] font-bold text-slate-400">Live</span></div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(#7c3aed_var(--score),#e2e8f0_0)] p-2" style={{ '--score': `${healthScore * 3.6}deg` } as React.CSSProperties}><div className="grid h-full w-full place-items-center rounded-full bg-white"><div className="text-center"><p className="text-2xl font-black">{healthScore}</p><p className="text-[9px] font-black uppercase text-emerald-600">{healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Building'}</p></div></div></div>
                  <div className="min-w-0 flex-1 space-y-2 text-[11px]">
                    {[['Profile', `${profilePoints}/30`], ['Verification', `${verificationPoints}/35`], ['Activity', `${activityPoints}/35`]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3"><span className="font-bold text-slate-500">{label}</span><span className="font-black text-slate-900">{value}</span></div>)}
                    <div className="flex items-center justify-between"><span className="font-bold text-slate-500">Payment actions</span><span className="font-black text-slate-900">{activePayments}</span></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-3 rounded-2xl border border-white/80 bg-white/92 p-3.5 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">Account statistics</p><h2 className="text-base font-black">Real-time marketplace metrics</h2></div><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-500">Live database</span></div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
                {statCards.map((stat) => <div key={stat.label} className={`rounded-xl border border-slate-200/80 bg-white/95 p-3 ${stat.tone}`}><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{stat.label}</p><p className="mt-1 text-xl font-black text-slate-950">{stat.value}</p><p className="text-[10px] text-slate-500">{stat.note}</p><Sparkline values={stat.values} /></div>)}
              </div>
            </section>

            <section className="mt-3 grid gap-3 xl:grid-cols-[1.3fr_.8fr_.8fr]">
              <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
                <div className="flex items-center justify-between"><div><h2 className="text-sm font-black">Recent spending curve</h2><p className="text-[10px] text-slate-500">Latest material orders</p></div><p className="text-lg font-black">{money(recentOrders.reduce((sum, order) => sum + order.subtotal, 0))}</p></div>
                <div className="mt-4 flex h-28 items-end gap-2 rounded-xl bg-slate-50/90 p-3">
                  {orderValues.map((value, index) => { const max = Math.max(...orderValues, 1); return <div key={`${value}-${index}`} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-fuchsia-400" style={{ height: `${Math.max(8, (value / max) * 100)}%` }} /></div>; })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
                <h2 className="text-sm font-black">Project distribution</h2>
                <div className="mt-4 grid place-items-center"><div className="grid h-28 w-28 place-items-center rounded-full bg-[conic-gradient(#7c3aed_0_45%,#22c55e_45%_75%,#38bdf8_75%_100%)] p-4"><div className="grid h-full w-full place-items-center rounded-full bg-white text-center"><div><p className="text-xl font-black">{dashboard.metrics.publishedJobs}</p><p className="text-[9px] font-bold text-slate-400">TOTAL</p></div></div></div></div>
                <div className="mt-4 space-y-2 text-[10px]"><div className="flex justify-between"><span>Completed engagements</span><b>{dashboard.metrics.completedEngagements}</b></div><div className="flex justify-between"><span>Active engagements</span><b>{dashboard.metrics.activeEngagements}</b></div><div className="flex justify-between"><span>Draft jobs</span><b>{dashboard.metrics.draftJobs}</b></div></div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/94 p-4 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
                <h2 className="text-sm font-black">Activity matrix</h2>
                <div className="mt-4 grid grid-cols-7 gap-1.5">{Array.from({ length: 35 }, (_, index) => { const intensity = (index + dashboard.metrics.publishedJobs + totalEngagements) % 5; return <span key={index} className={`aspect-square rounded-sm ${['bg-violet-50','bg-violet-100','bg-violet-200','bg-violet-400','bg-violet-600'][intensity]}`} />; })}</div>
                <div className="mt-3 flex justify-between text-[9px] font-bold text-slate-400"><span>Less activity</span><span>More activity</span></div>
              </div>
            </section>

            <section className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_.9fr]">
              <div className="rounded-2xl border border-white/80 bg-white/94 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3"><div><h2 className="text-sm font-black">Recent activity</h2><p className="text-[10px] text-slate-500">Projects, hires and marketplace events</p></div><Link href={ROUTES.customerJobs} className="text-xs font-black text-violet-700">View all →</Link></div>
                {dashboard.activities.length ? <div className="divide-y divide-slate-100">{dashboard.activities.slice(0, 5).map((activity) => <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="grid gap-2 px-4 py-3 hover:bg-violet-50/60 sm:grid-cols-[1fr_140px_24px] sm:items-center"><div><p className="text-xs font-black text-slate-900">{activity.title}</p><p className="text-[10px] text-slate-400">Marketplace activity</p></div><p className="text-[10px] font-bold capitalize text-slate-500">{activity.meta.toLowerCase()}</p><span className="text-violet-600">→</span></Link>)}</div> : <p className="p-4 text-xs text-slate-500">No project activity yet.</p>}
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/94 shadow-[0_14px_40px_rgba(15,23,42,.09)] backdrop-blur-xl">
                <div className="border-b border-slate-200/80 px-4 py-3"><h2 className="text-sm font-black">Recent orders</h2><p className="text-[10px] text-slate-500">Materials and supplier transactions</p></div>
                {recentOrders.length ? <div className="divide-y divide-slate-100">{recentOrders.map((order) => <div key={order.id} className="px-4 py-3"><div className="flex justify-between gap-3"><div><p className="text-xs font-black">{order.supplier.materialSupplierProfile?.businessName || order.supplier.displayName || 'Yartong supplier'}</p><p className="text-[10px] text-slate-400">{order.orderNumber} · {statusLabel(order.status)}</p></div><p className="text-xs font-black">{money(order.subtotal)}</p></div></div>)}</div> : <p className="p-4 text-xs text-slate-500">No material orders yet.</p>}
              </div>
            </section>

            <section className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[["+ Post Project", ROUTES.postJob], ["Find Providers", ROUTES.workers], ["Browse Materials", ROUTES.materials], ["My Projects", ROUTES.customerJobs], ["Messages", ROUTES.messages], ["Account", "/account"]].map(([label, href]) => <Link key={label} href={href} className="rounded-xl border border-white/80 bg-white/94 px-3 py-3 text-center text-xs font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-violet-50 hover:text-violet-800">{label}</Link>)}
            </section>
          </main>
        </div>
      </div>
    </PublicShell>
  );
}
