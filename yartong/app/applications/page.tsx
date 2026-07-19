import { ApplicationStatus, UserRole } from "@prisma/client";
import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";
import { withdrawApplicationAction } from "@/app/jobs/[id]/actions";

const PROVIDER_ROLES = [UserRole.SKILLED_PROVIDER, UserRole.LABOURER, UserRole.CONTRACTOR];

export default async function ApplicationsPage() {
  const user = await requireRole(PROVIDER_ROLES);
  const applications = await prisma.jobApplication.findMany({
    where: { providerId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      message: true,
      proposedPrice: true,
      proposedTimelineDays: true,
      createdAt: true,
      engagement: { select: { id: true } },
      job: {
        select: {
          id: true,
          title: true,
          status: true,
          currency: true,
          location: { select: { name: true, state: true } },
        },
      },
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-black">My applications</h1>
          <Link href="/engagements" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">
            View engagements
          </Link>
        </div>
        <div className="mt-8 space-y-4">
          {applications.length === 0 ? <p className="text-white/60">You have not applied to any jobs yet.</p> : null}
          {applications.map((application) => (
            <article key={application.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/jobs/${application.job.id}`} className="text-xl font-black hover:underline">{application.job.title}</Link>
                  <p className="mt-1 text-sm text-white/55">{application.job.location.name}, {application.job.location.state}</p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{application.status}</span>
              </div>
              <p className="mt-4 text-white/70">{application.message}</p>
              <p className="mt-3 text-sm text-white/55">
                Proposed price: {application.proposedPrice === null ? "Not specified" : formatMoney(application.proposedPrice, application.job.currency)} · Timeline: {application.proposedTimelineDays ? `${application.proposedTimelineDays} days` : "Not specified"}
              </p>
              {application.status === ApplicationStatus.SUBMITTED || application.status === ApplicationStatus.SHORTLISTED ? (
                <form action={withdrawApplicationAction.bind(null, application.id)} className="mt-4">
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Withdraw application</button>
                </form>
              ) : null}
              {application.status === ApplicationStatus.ACCEPTED && application.engagement ? (
                <Link href={`/engagements/${application.engagement.id}`} className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-[#14091f]">
                  Open work engagement
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
