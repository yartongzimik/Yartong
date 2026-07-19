import {
  VerificationRequestStatus,
  VerificationRequestType,
} from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import {
  cancelVerificationRequestAction,
  submitVerificationRequestAction,
} from "./actions";

const TYPE_LABELS: Record<VerificationRequestType, string> = {
  IDENTITY: "Identity verification",
  BUSINESS: "Business verification",
  PROFESSIONAL_CREDENTIAL: "Professional credential review",
};

export default async function VerificationPage() {
  const user = await requireUser();
  const requests = await prisma.verificationRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      status: true,
      applicantNote: true,
      reviewerNote: true,
      submittedAt: true,
      reviewedAt: true,
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Trust & verification
        </p>
        <h1 className="mt-3 text-4xl font-black">Verification center</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Current trust level: {user.verificationStatus.replaceAll("_", " ").toLowerCase()}.
          Verification requests are reviewed by Yartong. External KYC or business-verification providers can be connected later without changing this workflow.
        </p>

        <form action={submitVerificationRequestAction} className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <div>
            <label htmlFor="type" className="font-black">Verification type</label>
            <select id="type" name="type" required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#16091f] px-4 py-3 text-white">
              <option value="">Choose a verification type</option>
              {Object.values(VerificationRequestType).map((type) => (
                <option key={type} value={type}>{TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="applicantNote" className="font-black">Notes for the reviewer</label>
            <textarea id="applicantNote" name="applicantNote" rows={4} maxLength={2000} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Provide context only. Do not paste passwords, bank details, or authentication secrets." />
          </div>
          <button className="w-fit rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Submit verification request</button>
        </form>

        <section className="mt-10">
          <h2 className="text-2xl font-black">Request history</h2>
          <div className="mt-4 space-y-3">
            {requests.length === 0 ? <p className="text-white/55">No verification requests yet.</p> : null}
            {requests.map((request) => (
              <article key={request.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-black">{TYPE_LABELS[request.type]}</p><p className="mt-1 text-sm text-white/50">Submitted {request.submittedAt.toLocaleDateString("en-IN")}</p></div>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black">{request.status.replaceAll("_", " ")}</span>
                </div>
                {request.reviewerNote ? <p className="mt-4 text-sm text-white/65">Reviewer note: {request.reviewerNote}</p> : null}
                {request.status === VerificationRequestStatus.SUBMITTED ? (
                  <form action={cancelVerificationRequestAction.bind(null, request.id)} className="mt-4">
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Cancel request</button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
