import Link from "next/link";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

function money(value: number | null) { return value == null ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100); }

export default async function CustomerProjectsPage() {
  const user = await requireUser();
  const jobs = await prisma.job.findMany({ where: { customerId: user.id }, orderBy: { updatedAt: "desc" }, take: 12, select: { id: true, title: true, status: true, category: true, budgetMin: true, budgetMax: true, updatedAt: true, applications: { select: { id: true } }, engagements: { select: { id: true, status: true } } } });
  const inProgress = jobs.filter((job) => job.engagements.some((item) => item.status === "IN_PROGRESS")).length;
  const completed = jobs.filter((job) => job.engagements.some((item) => item.status === "COMPLETED")).length;
  const drafts = jobs.filter((job) => job.status === "DRAFT").length;
  const budget = jobs.reduce((sum, job) => sum + (job.budgetMax ?? job.budgetMin ?? 0), 0);

  return <CustomerWorkspaceShell active="My Projects" title="My Projects" subtitle="Manage construction, repair and service projects from one control panel." actions={<Link href="/post-job" className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-black text-white">+ New Project</Link>}>
    <section className="grid grid-cols-2 gap-2 md:grid-cols-4">{[["Total projects", jobs.length], ["In progress", inProgress], ["Completed", completed], ["Portfolio budget", money(budget)]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/80 bg-white/94 p-3 shadow-sm backdrop-blur-xl"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>)}</section>
    <section className="mt-3 rounded-2xl border border-white/80 bg-white/94 shadow-sm backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3 text-[10px] font-black"><span className="rounded-lg bg-violet-600 px-3 py-1.5 text-white">All ({jobs.length})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">In Progress ({inProgress})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Completed ({completed})</span><span className="rounded-lg bg-slate-100 px-3 py-1.5">Drafts ({drafts})</span></div>
      <div className="divide-y divide-slate-100">{jobs.length ? jobs.map((job) => <article key={job.id} className="p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-black">{job.title}</h2><p className="mt-1 text-[10px] text-slate-400">{job.category || "General project"} · Updated {job.updatedAt.toLocaleDateString("en-IN")}</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{job.status.replaceAll("_", " ")}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400" style={{ width: `${job.engagements.some((item) => item.status === "COMPLETED") ? 100 : job.engagements.some((item) => item.status === "IN_PROGRESS") ? 65 : job.applications.length ? 35 : 15}%` }} /></div><div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] font-bold text-slate-500"><span>{job.applications.length} applications · {job.engagements.length} engagements</span><span>Budget {money(job.budgetMin)} – {money(job.budgetMax)}</span></div></article>) : <p className="p-5 text-xs text-slate-500">No projects yet.</p>}</div>
    </section>
  </CustomerWorkspaceShell>;
}
