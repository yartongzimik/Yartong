import Link from "next/link";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerDashboardBackground } from "./dashboard/customer-dashboard-background";

const NAV = [
  ["Dashboard", "/customer/dashboard"],
  ["My Projects", "/customer/projects"],
  ["Messages", "/customer/messages"],
  ["Materials", "/customer/materials"],
  ["Orders", "/customer/orders"],
  ["Payments", "/customer/payments"],
  ["Reviews", "/customer/reviews"],
  ["Alerts", "/customer/alerts"],
  ["Saved Items", "/customer/saved"],
  ["Settings", "/customer/settings"],
] as const;

export async function CustomerWorkspaceShell({ active, title, subtitle, actions, children }: { active: string; title: string; subtitle: string; actions?: ReactNode; children: ReactNode }) {
  const user = await requireUser();
  const [profile, unreadMessages, unreadAlerts] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { displayName: true, image: true } }),
    prisma.message.count({ where: { conversation: { customerId: user.id }, senderId: { not: user.id }, readAt: null } }),
    prisma.notification.count({ where: { userId: user.id, readAt: null } }),
  ]);

  return (
    <PublicShell>
      <div className="relative min-h-screen overflow-hidden bg-[#eef3f8] text-slate-950">
        <CustomerDashboardBackground />
        <div className="relative mx-auto grid w-full max-w-[1680px] md:grid-cols-[205px_minmax(0,1fr)]">
          <aside className="min-h-[calc(100vh-80px)] border-r border-white/80 bg-white/94 p-3 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-violet-100 text-xs font-black text-violet-700">{profile.image ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.image})` }} /> : (profile.displayName || "C").slice(0, 1)}</div>
              <div className="min-w-0"><p className="truncate text-xs font-black">{profile.displayName || "Customer"}</p><p className="text-[10px] text-slate-400">Customer workspace</p></div>
            </div>
            <nav className="space-y-1">
              {NAV.map(([label, href]) => {
                const selected = active === label;
                const badge = label === "Messages" ? unreadMessages : label === "Alerts" ? unreadAlerts : 0;
                return <Link key={label} href={href} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition ${selected ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}><span>{label}</span>{badge ? <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${selected ? "bg-white/20 text-white" : "bg-violet-100 text-violet-700"}`}>{badge}</span> : null}</Link>;
              })}
            </nav>
            <div className="mt-5 border-t border-slate-200 pt-4 text-xs">
              <Link href="/account" className="block rounded-lg px-3 py-2 font-bold text-slate-600 hover:bg-slate-100">My account</Link>
            </div>
          </aside>
          <main className="min-w-0 p-3 sm:p-4 lg:p-5">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/94 px-4 py-3 shadow-sm backdrop-blur-xl">
              <div><h1 className="text-xl font-black sm:text-2xl">{title}</h1><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </header>
            {children}
            <footer className="mt-3 grid gap-2 rounded-2xl border border-white/80 bg-white/92 p-3 text-[10px] font-bold text-slate-500 shadow-sm backdrop-blur-xl sm:grid-cols-4">
              <span>✓ Secure & verified</span><span>◇ Best price signals</span><span>◉ Quality assurance</span><span>◷ Local delivery tracking</span>
            </footer>
          </main>
        </div>
      </div>
    </PublicShell>
  );
}
