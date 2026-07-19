import { VerificationRequestStatus } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { reviewVerificationRequestAction } from "./actions";

export default async function AdminVerificationsPage() {
  await requireRole("ADMIN");
  const requests = await prisma.verificationRequest.findMany({
    where: {
      status: {
        in: [
          VerificationRequestStatus.SUBMITTED,
          VerificationRequestStatus.UNDER_REVIEW,
        ],
      },
    },
    orderBy: { submittedAt: "asc" },
    select: {
      id: true,
      type: true,
      status: true,
      applicantNote: true,
      submittedAt: true,
      applicant: {
        select: {
          id: true,
          displayName: true,
          primaryRole: true,
          verificationStatus: true,
        },
      },
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Admin trust operations
        </p>
        <h1 className="mt-3 text-4xl font-black">Verification review queue</h1>
        <p className="mt-3 text-white/60">Review requests without exposing authentication/session data or collecting production credentials in source code.</p>

        <div className="mt-8 space-y-4">
          {requests.length === 0 ? <p className="text-white/55">No active verification requests.</p> : null}
          {requests.map((request) => (
            <article key={request.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black">{request.applicant.displayName || "Yartong member"}</p>
                  <p className="mt-1 text-sm text-white/55">{request.applicant.primaryRole} · current trust: {request.applicant.verificationStatus}</p>
                  <p className="mt-1 text-sm text-white/55">Request: {request.type} · {request.status}</p>
                </div>
                <p className="text-xs text-white/40">{request.submittedAt.toLocaleString("en-IN")}</p>
              </div>
              {request.applicantNote ? <p className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-6 text-white/70">Applicant note: {request.applicantNote}</p> : null}

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <form action={reviewVerificationRequestAction.bind(null, request.id, VerificationRequestStatus.UNDER_REVIEW)} className="space-y-3">
                  <textarea name="reviewerNote" rows={3} maxLength={2000} placeholder="Internal review note" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Mark under review</button>
                </form>
                <form action={reviewVerificationRequestAction.bind(null, request.id, VerificationRequestStatus.APPROVED)} className="space-y-3">
                  <textarea name="reviewerNote" rows={3} maxLength={2000} placeholder="Approval note" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                  <button className="rounded-full bg-emerald-200 px-4 py-2 text-sm font-black text-[#102019]">Approve verification</button>
                </form>
                <form action={reviewVerificationRequestAction.bind(null, request.id, VerificationRequestStatus.REJECTED)} className="space-y-3">
                  <textarea name="reviewerNote" rows={3} maxLength={2000} placeholder="Reason for rejection" className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" />
                  <button className="rounded-full border border-rose-200/25 px-4 py-2 text-sm font-bold text-rose-100">Reject request</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
