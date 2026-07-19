import { ApplicationStatus, JobStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { JobStatusBadge } from "@/components/marketplace/job-ui";
import { requireRole } from "@/lib/authz";
import { JOB_PROVIDER_ROLE_LABELS, JOB_URGENCY_LABELS, ROUTES } from "@/lib/constants";
import { formatBudget, formatMoney } from "@/lib/jobs/validation";
import { getCustomerJob } from "@/lib/marketplace/jobs";
import { prisma } from "@/lib/prisma";

import { transitionJobAction } from "../actions";
import { acceptApplicationAction, setApplicationStatusAction } from "./application-actions";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerJobDetail({ params }: Props) {
  const user = await requireRole("CUSTOMER");
  const { id } = await params;
  const job = await getCustomerJob(user.id, id);
  if (!job) notFound();

  const applications = await prisma.jobApplication.findMany({
    where: { jobId: job.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      status: true,
      message: true,
      proposedPrice: true,
      proposedTimelineDays: true,
      providerRole: true,
      provider: { select: { id: true, displayName: true, verificationStatus: true } },
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <JobStatusBadge status={job.status} />
        <h1 className="mt-4 text-5xl font-black">{job.title}</h1>
        <p className="mt-3 text-white/60">{job.location.name} · {formatBudget(job.budgetType, job.budgetMin, job.budgetMax, job.currency)} · {JOB_URGENCY_LABELS[job.urgency]}</p>
        <p className="mt-6 whitespace-pre-wrap rounded-3xl border border-white/10 bg-white/[0.06] p-6 leading-7 text-white/75">{job.description}</p>
        <p className="mt-4 text-white/60">Targets: {job.targetProviderRoles.map((role) => JOB_PROVIDER_ROLE_LABELS[role]).join(", ")}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {job.status === JobStatus.DRAFT ? <><Link href={`${ROUTES.customerJobs}/${job.id}/edit`} className="rounded-full border border-white/15 px-5 py-3 font-black">Edit</Link><form action={transitionJobAction.bind(null, job.id, JobStatus.PUBLISHED)}><button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Publish</button></form><form action={transitionJobAction.bind(null, job.id, JobStatus.CANCELLED)}><button className="rounded-full border border-white/15 px-5 py-3 font-black">Cancel</button></form></> : null}
          {job.status === JobStatus.PUBLISHED ? <><form action={transitionJobAction.bind(null, job.id, JobStatus.CLOSED)}><button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Close</button></form><form action={transitionJobAction.bind(null, job.id, JobStatus.CANCELLED)}><button className="rounded-full border border-white/15 px-5 py-3 font-black">Cancel</button></form></> : null}
        </div>

        <section className="mt-12">
          <h2 className="text-3xl font-black">Applications ({applications.length})</h2>
          <div className="mt-6 space-y-4">
            {applications.length === 0 ? <p className="text-white/60">No applications yet.</p> : null}
            {applications.map((application) => {
              const actionable = job.status === JobStatus.PUBLISHED && (application.status === ApplicationStatus.SUBMITTED || application.status === ApplicationStatus.SHORTLISTED);
              return (
                <article key={application.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><Link href={`/providers/${application.provider.id}`} className="text-xl font-black hover:underline">{application.provider.displayName || "Provider"}</Link><p className="text-sm text-white/55">{JOB_PROVIDER_ROLE_LABELS[application.providerRole]} · {application.provider.verificationStatus}</p></div>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{application.status}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-white/75">{application.message}</p>
                  <p className="mt-3 text-sm text-white/55">Proposed price: {application.proposedPrice === null ? "Not specified" : formatMoney(application.proposedPrice, job.currency)} · Timeline: {application.proposedTimelineDays ? `${application.proposedTimelineDays} days` : "Not specified"}</p>
                  {actionable ? <div className="mt-4 flex flex-wrap gap-2">
                    {application.status === ApplicationStatus.SUBMITTED ? <form action={setApplicationStatusAction.bind(null, job.id, application.id, ApplicationStatus.SHORTLISTED)}><button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Shortlist</button></form> : null}
                    <form action={acceptApplicationAction.bind(null, job.id, application.id)}><button className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#14091f]">Accept & hire</button></form>
                    <form action={setApplicationStatusAction.bind(null, job.id, application.id, ApplicationStatus.REJECTED)}><button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Reject</button></form>
                  </div> : null}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}