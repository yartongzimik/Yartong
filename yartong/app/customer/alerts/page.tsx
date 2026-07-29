import Link from "next/link";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

export default async function CustomerAlertsPage() {
  const user = await requireUser();
  const alerts = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30, select: { id: true, type: true, title: true, body: true, href: true, readAt: true, createdAt: true } });
  const unread = alerts.filter((alert) => !alert.readAt).length;
  return <CustomerWorkspaceShell active="Alerts" title="Alerts" subtitle="Stay updated with project, order, payment and account notifications.">
    <section className="rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3"><div className="flex gap-2 text-[10px] font-black"><span className="rounded-lg bg-violet-600 px-3 py-1.5 text-white">All ({alerts.length})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Unread ({unread})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">System</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Projects</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Orders</span></div><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black">Mark all as read</button></div><div className="divide-y divide-slate-100">{alerts.length ? alerts.map((alert) => { const content = <div className={`flex gap-3 p-4 ${!alert.readAt ? "bg-violet-50/50" : ""}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-black text-violet-700">{alert.type.slice(0,1)}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="text-xs font-black">{alert.title}</p><time className="shrink-0 text-[9px] text-slate-400">{alert.createdAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</time></div><p className="mt-1 text-[11px] leading-5 text-slate-500">{alert.body}</p></div>{!alert.readAt ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-600" /> : null}</div>; return alert.href ? <Link key={alert.id} href={alert.href}>{content}</Link> : <div key={alert.id}>{content}</div>; }) : <div className="p-5"><p className="text-xs text-slate-500">No alerts yet. Project updates, messages, orders and verification notices will appear here.</p></div>}</div></section>
  </CustomerWorkspaceShell>;
}
