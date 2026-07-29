import Link from "next/link";

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

  const [dashboard, profile, materialOrders, paidServices, notifications, reviewsWritten, activePayments, recentOrders] = await Promise.all([
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
      where: { customerId: user.id, status: "PAID" },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
    prisma.review.count({ where: { authorId: user.id } }),
    prisma.paymentOrder.count({ where: { customerId: user.id, status: { in: ["CREATED", "AUTHORIZED"] } } }),
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
  const totalServiceSpend = paidServices._sum.amount ?? 0;
  const completionRate = dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements > 0
    ? Math.round((dashboard.metrics.completedEngagements / (dashboard.metrics.completedEngagements + dashboard.metrics.activeEngagements)) * 100)
    : 0;

  const statCards = [
    { label: "Active projects", value: dashboard.metrics.activeEngagements, helper: `${dashboard.metrics.completedEngagements} completed` },
    { label: "Published requests", value: dashboard.metrics.publishedJobs, helper: `${dashboard.metrics.draftJobs} drafts` },
    { label: "Material orders", value: materialOrders, helper: "Across Yartong suppliers" },
    { label: "Service spend", value: money(totalServiceSpend), helper: `${paidServices._count.id} paid engagements` },
    { label: "Unread messages", value: dashboard.metrics.unreadMessages, helper: "Provider conversations" },
    { label: "Reviews given", value: reviewsWritten, helper: "Marketplace feedback" },
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
        <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden min-h-[calc(100vh-80px)] border-r border-slate-200 bg-white p-5 lg:block">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Customer workspace</p>
            <nav className="space-y-1.5">
              {navItems.map(([label, href], index) => (
                <Link key={label} href={href} className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${index === 0 ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                  <span>{label}</span>
                  {label === "Messages" && dashboard.metrics.unreadMessages ? <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] text-white">{dashboard.metrics.unreadMessages}</span> : null}
                  {label === "Notifications" && notifications ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">{notifications}</span> : null}
                </Link>
              ))}
            </nav>
            <div className="mt-8 border-t border-slate-200 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Discover</p>
              <div className="mt-3 space-y-1.5">
                <Link href={ROUTES.workers} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Find professionals</Link>
                <Link href={ROUTES.materials} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Shop materials</Link>
                <Link href={ROUTES.quickJobs} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Quick jobs</Link>
              </div>
            </div>
          </aside>

          <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Customer Dashboard</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Welcome, {profile.displayName || "Customer"}</h1>
                <p className="mt-2 text-sm text-slate-500">Track projects, providers, material orders, messages and spending from one place.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={ROUTES.workers} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">Find a Provider</Link>
                <Link href={ROUTES.postJob} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm">+ Post a Project</Link>
              </div>
            </header>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-xl font-black">Activity & account statistics</h2>
                  <p className="mt-1 text-sm text-slate-500">A live summary of how you use Yartong.</p>
                </div>
                <Link href="/account" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">Edit profile</Link>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-6">
                {statCards.map((stat) => (
                  <div key={stat.label} className="border-b border-r border-slate-100 p-5 xl:border-b-0">
                    <p className="text-xs font-bold text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{stat.helper}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.7fr)]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-xl font-black">Projects & hired services</h2>
                    <p className="mt-1 text-sm text-slate-500">Your latest job posts and provider engagements.</p>
                  </div>
                  <Link href={ROUTES.customerJobs} className="text-sm font-black text-violet-700">View all projects →</Link>
                </div>
                {dashboard.activities.length ? (
                  <div className="divide-y divide-slate-100">
                    {dashboard.activities.map((activity) => (
                      <Link key={`${activity.href}-${activity.title}`} href={activity.href} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_180px_40px] sm:items-center sm:px-6">
                        <div><p className="font-black text-slate-900">{activity.title}</p><p className="mt-1 text-xs text-slate-400">Yartong marketplace activity</p></div>
                        <p className="text-sm font-bold capitalize text-slate-500">{activity.meta.toLowerCase()}</p>
                        <span className="text-right text-violet-600">→</span>
                      </Link>
                    ))}
                  </div>
                ) : <p className="p-6 text-sm text-slate-500">No project activity yet. Post your first project to begin.</p>}
              </div>

              <aside className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-black">Account health</h2>
                  <div className="mt-5 space-y-4">
                    <div><div className="flex justify-between text-sm"><span className="font-bold text-slate-500">Project completion</span><span className="font-black">{completionRate}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${completionRate}%` }} /></div></div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Verification</p><p className="mt-1 font-black">{VERIFICATION_LABELS[profile.verificationStatus]}</p></div>
                      <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Payment actions</p><p className="mt-1 font-black">{activePayments}</p></div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="text-xs font-bold text-slate-400">Primary location</p><p className="mt-1 font-black">{location ? `${location.name}, ${location.state}` : "Not set"}</p></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-violet-700 to-fuchsia-600 p-5 text-white shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Need something done?</p>
                  <h2 className="mt-2 text-2xl font-black">Start your next project</h2>
                  <p className="mt-2 text-sm leading-6 text-white/75">Post your requirement and compare skilled providers, labourers and contractors.</p>
                  <Link href={ROUTES.postJob} className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-black text-violet-800">Post a Project</Link>
                </div>
              </aside>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6"><div><h2 className="text-xl font-black">Material purchases</h2><p className="mt-1 text-sm text-slate-500">Recent orders from Yartong suppliers.</p></div><Link href={ROUTES.materials} className="text-sm font-black text-violet-700">Browse materials →</Link></div>
                {recentOrders.length ? <div className="divide-y divide-slate-100">{recentOrders.map((order) => <div key={order.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_130px_110px] sm:items-center sm:px-6"><div><p className="font-black">{order.supplier.materialSupplierProfile?.businessName || order.supplier.displayName || "Yartong supplier"}</p><p className="mt-1 text-xs text-slate-400">Order {order.orderNumber}</p></div><span className="text-sm font-bold text-slate-500">{statusLabel(order.status)}</span><span className="text-sm font-black sm:text-right">{money(order.subtotal)}</span></div>)}</div> : <p className="p-6 text-sm text-slate-500">No material orders yet. Browse the materials marketplace to compare local suppliers.</p>}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 className="text-xl font-black">Quick access</h2><p className="mt-1 text-sm text-slate-500">Everything a customer can do on Yartong.</p></div>
                <div className="grid sm:grid-cols-2">
                  {[
                    ["Find professionals", "Browse skilled providers, labourers and contractors", ROUTES.workers],
                    ["Shop materials", "Compare supplier listings and local stock", ROUTES.materials],
                    ["My projects", "Manage drafts, published jobs and applicants", ROUTES.customerJobs],
                    ["Hired services", "Track scope, quotes, progress and payments", "/engagements"],
                    ["Messages", "Continue private provider conversations", ROUTES.messages],
                    ["Account & preferences", "Edit profile, phone, location and personal details", "/account"],
                  ].map(([title, description, href]) => <Link key={title} href={href} className="border-b border-r border-slate-100 p-5 transition hover:bg-slate-50"><p className="font-black text-slate-900">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><span className="mt-3 inline-block text-sm font-black text-violet-700">Open →</span></Link>)}
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">Customer profile summary</h2>
                  <p className="mt-1 text-sm text-slate-500">The account details Yartong uses to personalize your experience.</p>
                </div>
                <Link href="/account" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black">Edit account</Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Name</p><p className="mt-1 font-black">{profile.displayName || "Not set"}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Phone</p><p className="mt-1 font-black">{profile.phoneNumber || "Not set"}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Languages</p><p className="mt-1 font-black">{profile.customerProfile?.preferredLanguages.length ? profile.customerProfile.preferredLanguages.join(", ") : "Not set"}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Member since</p><p className="mt-1 font-black">{profile.createdAt.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p></div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </PublicShell>
  );
}
