import Link from "next/link";
import { PaymentStatus } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { ROUTES, VERIFICATION_LABELS } from "@/lib/constants";
import { getCustomerDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/^./, (char) => char.toUpperCase());
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
    prisma.paymentOrder.aggregate({
      where: { customerId: user.id, status: PaymentStatus.SUCCEEDED },
      _sum: { amount: true },
    }),
    prisma.paymentOrder.count({ where: { customerId: user.id, status: PaymentStatus.SUCCEEDED } }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
    prisma.review.count({ where: { authorId: user.id } }),
    prisma.paymentOrder.count({
      where: {
        customerId: user.id,
        status: { in: [PaymentStatus.CREATED, PaymentStatus.PENDING, PaymentStatus.REQUIRES_ACTION, PaymentStatus.PROCESSING] },
      },
    }),
    prisma.materialOrder.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
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
  const completionRate = dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements > 0
    ? Math.round((dashboard.metrics.completedEngagements / (dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements)) * 100)
    : 0;

  const statCards = [
    { label: "Active projects", value: dashboard.metrics.activeEngagements, helper: `${dashboard.metrics.completedEngagements} completed` },
    { label: "Published requests", value: dashboard.metrics.publishedJobs, helper: `${dashboard.metrics.draftJobs} drafts` },
    { label: "Material orders", value: materialOrders, helper: "Supplier orders" },
    { label: "Service spend", value: money(totalServiceSpend), helper: `${paidServiceCount} paid` },
    { label: "Unread messages", value: dashboard.metrics.unreadMessages, helper: "Conversations" },
    { label: "Reviews given", value: reviewsWritten, helper: "Feedback" },
  ];

  const navItems = [
    ["Overview", "/customer/dashboard"],
    ["My Projects", ROUTES.customerJobs],
    ["Hired Services", "/engagements"],
    ["Material Orders", ROUTES.materials],
    ["Messages", ROUTES.messages],
    ["Notifications", "/notifications"],
    ["Account", "/account"],
  ] as const;

  return (
    <PublicShell>
      <div className="min-h-screen bg-[#f5f6f8] text-slate-950">
        <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[190px_minmax(0,1fr)]">
          <aside className="hidden min-h-[calc(100vh-80px)] border-r border-slate-200 bg-white p-3 lg:block">
            <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Customer workspace</p>
            <nav className="space-y-1">
              {navItems.map(([label, href], index) => (
                <Link key={label} href={href} className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold transition ${index === 0 ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                  <span>{label}</span>
                  {label === "Messages" && dashboard.metrics.unreadMessages ? <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] text-white">{dashboard.metrics.unreadMessages}</span> : null}
                  {label === "Notifications" && notifications ? <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] text-white">{notifications}</span> : null}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="px-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Discover</p>
              <div className="mt-1.5 space-y-1">
                <Link href={ROUTES.workers} className="block rounded-lg px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Find professionals</Link>
                <Link href={ROUTES.materials} className="block rounded-lg px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Shop materials</Link>
                <Link href={ROUTES.quickJobs} className="block rounded-lg px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Quick jobs</Link>
              </div>
            </div>
          </aside>

          <main className="min-w-0 px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">Customer Dashboard</p>
                <h1 className="mt-0.5 text-2xl font-black tracking-tight sm:text-3xl">Welcome, {profile.displayName || "Customer"}</h1>
                <p className="mt-1 text-xs text-slate-500">Projects, providers, materials, messages and spending at a glance.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={ROUTES.workers} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">Find a Provider</Link>
                <Link href={ROUTES.postJob} className="rounded-lg bg-slate-950 px-3.5 py-2 text-xs font-black text-white shadow-sm">+ Post a Project</Link>
              </div>
            </header>

            <section className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                <div><h2 className="text-base font-black">Activity & account statistics</h2><p className="text-xs text-slate-500">Live account summary.</p></div>
                <Link href="/account" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-700">Edit profile</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                {statCards.map((stat) => (
                  <div key={stat.label} className="border-b border-r border-slate-100 px-3 py-3 xl:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{stat.value}</p>
                    <p className="text-[11px] text-slate-500">{stat.helper}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,.65fr)]">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                  <div><h2 className="text-base font-black">Projects & hired services</h2><p className="text-xs text-slate-500">Latest activity.</p></div>
                  <Link href={ROUTES.customerJobs} className="text-xs font-black text-violet-700">View all →</Link>
                </div>
                {dashboard.activities.length ? (
                  <div className="divide-y divide-slate-100">
                    {dashboard.activities.map((activity) => (
                      <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="grid gap-2 px-4 py-2.5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_150px_24px] sm:items-center">
                        <div><p className="text-sm font-black text-slate-900">{activity.title}</p><p className="text-[11px] text-slate-400">Yartong marketplace activity</p></div>
                        <p className="text-xs font-bold capitalize text-slate-500">{activity.meta.toLowerCase()}</p>
                        <span className="text-right text-violet-600">→</span>
                      </Link>
                    ))}
                  </div>
                ) : <p className="p-4 text-xs text-slate-500">No project activity yet. Post your first project to begin.</p>}
              </div>

              <aside className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center justify-between"><h2 className="text-sm font-black">Account health</h2><span className="text-sm font-black">{completionRate}%</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${completionRate}%` }} /></div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Verification</p><p className="mt-0.5 font-black">{VERIFICATION_LABELS[profile.verificationStatus]}</p></div>
                    <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Payment actions</p><p className="mt-0.5 font-black">{activePayments}</p></div>
                  </div>
                  <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs"><p className="text-[10px] font-bold text-slate-400">Primary location</p><p className="mt-0.5 font-black">{location ? `${location.name}, ${location.state}` : "Not set"}</p></div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-violet-700 to-fuchsia-600 p-3.5 text-white shadow-sm">
                  <h2 className="text-base font-black">Start your next project</h2>
                  <p className="mt-1 text-xs leading-5 text-white/75">Post requirements and compare local providers.</p>
                  <Link href={ROUTES.postJob} className="mt-2.5 inline-flex rounded-lg bg-white px-3 py-2 text-xs font-black text-violet-800">Post a Project</Link>
                </div>
              </aside>
            </section>

            <section className="mt-3 grid gap-3 xl:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5"><div><h2 className="text-base font-black">Material purchases</h2><p className="text-xs text-slate-500">Recent supplier orders.</p></div><Link href={ROUTES.materials} className="text-xs font-black text-violet-700">Browse →</Link></div>
                {recentOrders.length ? <div className="divide-y divide-slate-100">{recentOrders.map((order) => <div key={order.id} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[1fr_110px_90px] sm:items-center"><div><p className="text-sm font-black">{order.supplier.materialSupplierProfile?.businessName || order.supplier.displayName || "Yartong supplier"}</p><p className="text-[11px] text-slate-400">Order {order.orderNumber}</p></div><span className="text-xs font-bold text-slate-500">{statusLabel(order.status)}</span><span className="text-xs font-black sm:text-right">{money(order.subtotal)}</span></div>)}</div> : <p className="p-4 text-xs text-slate-500">No material orders yet.</p>}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-2.5"><h2 className="text-base font-black">Quick access</h2></div>
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {[
                    ["Find professionals", ROUTES.workers],
                    ["Shop materials", ROUTES.materials],
                    ["My projects", ROUTES.customerJobs],
                    ["Hired services", "/engagements"],
                    ["Messages", ROUTES.messages],
                    ["Account", "/account"],
                  ].map(([title, href]) => <Link key={title} href={href} className="border-b border-r border-slate-100 p-3 text-xs font-black text-slate-800 transition hover:bg-slate-50">{title} <span className="text-violet-700">→</span></Link>)}
                </div>
              </div>
            </section>

            <section className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-black">Profile summary</h2><Link href="/account" className="text-xs font-black text-violet-700">Edit account →</Link></div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Name</p><p className="font-black">{profile.displayName || "Not set"}</p></div>
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Phone</p><p className="font-black">{profile.phoneNumber || "Not set"}</p></div>
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Languages</p><p className="font-black">{profile.customerProfile?.preferredLanguages.length ? profile.customerProfile.preferredLanguages.join(", ") : "Not set"}</p></div>
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-bold text-slate-400">Member since</p><p className="font-black">{profile.createdAt.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p></div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </PublicShell>
  );
}
