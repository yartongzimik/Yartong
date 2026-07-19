import { JobProviderRole, UserRole } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { getCurrentUser } from "@/lib/authz";
import { JOB_PROVIDER_ROLE_LABELS, JOB_URGENCY_LABELS } from "@/lib/constants";
import { getPublicJobById } from "@/lib/marketplace/jobs";
import { prisma } from "@/lib/prisma";

import { applyToJobAction } from "./actions";

const ROLE_MAP: Partial<Record<UserRole, JobProviderRole>> = {
  [UserRole.SKILLED_PROVIDER]: JobProviderRole.SKILLED_PROVIDER,
  [UserRole.LABOURER]: JobProviderRole.LABOURER,
  [UserRole.CONTRACTOR]: JobProviderRole.CONTRACTOR,
};

type Props = { params: Promise<{ id: string }> };

export default async function PublicJobPage({ params }: Props) {
  const { id } = await params;
  const [job, user] = await Promise.all([getPublicJobById(id), getCurrentUser()]);
  if (!job) notFound();

  const providerRole = user ? ROLE_MAP[user.primaryRole] : undefined;
  const eligible = Boolean(providerRole && job.targetProviderRoles.includes(providerRole));
  const existingApplication = user && providerRole
    ? await prisma.jobApplication.findUnique({
        where: { jobId_providerId: { jobId: job.id, providerId: user.id } },
        select: { status: true },
      })
    : null;

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <p className="text-fuchsia-100">{job.category} · {JOB_URGENCY_LABELS[job.urgency]}</p>
        <h1 className="mt-3 text-5xl font-black">{job.title}</h1>
        <p className="mt-3 text-white/60">{job.location.name}, {job.location.state} · {job.budgetLabel}</p>
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-2xl font-black">Job details</h2>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-white/75">{job.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-full border border-white/10 px-3 py-1 text-sm">{skill}</span>)}</div>
          <p className="mt-6 text-sm text-white/60">Targets: {job.targetProviderRoles.map((role) => JOB_PROVIDER_ROLE_LABELS[role]).join(", ")}</p>
          <p className="mt-2 text-sm text-white/60">Preferred start: {job.preferredStartDate?.toLocaleDateString("en-IN") ?? "Flexible"}</p>
          <p className="mt-2 text-sm text-white/60">Published: {job.publishedAt?.toLocaleDateString("en-IN")}</p>
        </section>

        <aside className="mt-6 rounded-3xl border border-fuchsia-200/20 bg-fuchsia-200/10 p-6">
          {!user ? (
            <><h2 className="text-xl font-black">Want to apply?</h2><p className="mt-2 text-white/65"><Link href="/login" className="underline">Sign in</Link> with an eligible provider account.</p></>
          ) : existingApplication ? (
            <><h2 className="text-xl font-black">Application {existingApplication.status.toLowerCase()}</h2><p className="mt-2 text-white/65"><Link href="/applications" className="underline">View your applications</Link>.</p></>
          ) : eligible ? (
            <form action={applyToJobAction.bind(null, job.id)} className="space-y-4">
              <h2 className="text-xl font-black">Apply to this job</h2>
              <label className="block"><span className="text-sm font-bold">Application message</span><textarea name="message" required maxLength={2000} rows={5} className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 p-3" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className="text-sm font-bold">Proposed price (₹, optional)</span><input name="proposedPrice" inputMode="numeric" className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 p-3" /></label>
                <label><span className="text-sm font-bold">Timeline in days (optional)</span><input name="proposedTimelineDays" inputMode="numeric" className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 p-3" /></label>
              </div>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Submit application</button>
            </form>
          ) : (
            <><h2 className="text-xl font-black">Applications unavailable for this account</h2><p className="mt-2 text-white/65">This listing is open only to its selected provider roles.</p></>
          )}
        </aside>
      </main>
    </PublicShell>
  );
}