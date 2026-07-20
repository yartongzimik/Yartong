import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import {
  DISPUTE_CATEGORIES,
  DISPUTE_CATEGORY_LABELS,
  getDisputeEvents,
  getParticipantDisputeByEngagement,
} from "@/lib/marketplace/disputes";
import { prisma } from "@/lib/prisma";

import {
  addDisputeStatementAction,
  openDisputeAction,
  withdrawDisputeAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function EngagementDisputePage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await prisma.engagement.findFirst({
    where: { id, OR: [{ customerId: user.id }, { providerId: user.id }] },
    select: { id: true, status: true, customerId: true, providerId: true, job: { select: { title: true } } },
  });
  if (!engagement) notFound();

  const dispute = await getParticipantDisputeByEngagement(user.id, id);
  const events = dispute ? await getDisputeEvents(dispute.id) : [];
  const canOpen = ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(engagement.status);
  const canPost = dispute && !["RESOLVED", "CANCELLED"].includes(dispute.status);
  const canWithdraw = dispute && dispute.openedById === user.id && ["OPEN", "AWAITING_RESPONSE"].includes(dispute.status);

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <Link href={`/engagements/${id}`} className="text-sm font-bold text-fuchsia-200">← Back to engagement</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/70">Yartong resolution centre</p>
        <h1 className="mt-3 text-4xl font-black">Dispute support</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          {engagement.job.title}. Keep the case factual and specific. Both participants can add statements, and Yartong staff can review the shared timeline.
        </p>

        {!dispute ? (
          canOpen ? (
            <form action={openDisputeAction.bind(null, id)} className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div>
                <label className="text-sm font-bold" htmlFor="category">What is the main issue?</label>
                <select id="category" name="category" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                  {DISPUTE_CATEGORIES.map((category) => <option key={category} value={category}>{DISPUTE_CATEGORY_LABELS[category]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="title">Short summary</label>
                <input id="title" name="title" required maxLength={160} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Example: Work stopped before the agreed scope was completed" />
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="description">What happened?</label>
                <textarea id="description" name="description" required maxLength={4000} rows={7} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Include dates, agreed expectations, what happened, and any steps already taken to resolve it." />
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="desiredOutcome">What outcome would feel fair?</label>
                <textarea id="desiredOutcome" name="desiredOutcome" maxLength={2000} rows={4} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="For example: finish the remaining work, correct specific defects, or review a payment disagreement." />
              </div>
              <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4 text-sm text-amber-50/80">
                Opening a dispute pauses the engagement lifecycle while the case is active. It does not automatically charge, refund, suspend, or penalize either participant.
              </div>
              <button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Open dispute</button>
            </form>
          ) : (
            <p className="mt-8 rounded-2xl border border-white/10 p-5 text-white/60">Disputes are available for confirmed, in-progress, or completed engagements.</p>
          )
        ) : (
          <>
            <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200/70">{dispute.status.replaceAll("_", " ")}</p>
                  <h2 className="mt-2 text-2xl font-black">{dispute.title}</h2>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{DISPUTE_CATEGORY_LABELS[dispute.category]}</span>
              </div>
              <p className="mt-5 whitespace-pre-wrap text-white/75">{dispute.description}</p>
              {dispute.desiredOutcome ? <p className="mt-4 rounded-2xl bg-white/[0.05] p-4 text-sm text-white/65"><strong className="text-white">Requested outcome:</strong> {dispute.desiredOutcome}</p> : null}
              {dispute.status === "RESOLVED" ? (
                <div className="mt-5 rounded-2xl border border-emerald-200/20 bg-emerald-200/10 p-4 text-emerald-50">
                  <p className="font-black">Resolution: {dispute.resolution?.replaceAll("_", " ") ?? "Resolved"}</p>
                  {dispute.resolutionNote ? <p className="mt-2 text-sm text-emerald-50/80">{dispute.resolutionNote}</p> : null}
                  {dispute.recommendedRefundAmount != null ? <p className="mt-2 text-sm">Recommended refund record: ₹{(dispute.recommendedRefundAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}. This does not itself move money.</p> : null}
                </div>
              ) : null}
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Case timeline</h2>
              <div className="mt-5 space-y-4">
                {events.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex flex-wrap justify-between gap-2 text-xs text-white/45">
                      <span>{event.actorName || "Yartong"} · {event.kind.replaceAll("_", " ")}</span>
                      <time>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(event.createdAt)}</time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">{event.body}</p>
                  </article>
                ))}
              </div>
            </section>

            {canPost ? (
              <form action={addDisputeStatementAction.bind(null, dispute.id)} className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <label className="font-black" htmlFor="body">Add a statement or update</label>
                <textarea id="body" name="body" required maxLength={4000} rows={5} className="mt-3 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Add facts, dates, actions taken, or a proposed solution. This will be visible to the other participant and Yartong support." />
                <button className="mt-4 rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Add to case</button>
              </form>
            ) : null}

            {canWithdraw ? (
              <form action={withdrawDisputeAction.bind(null, dispute.id)} className="mt-5">
                <button className="rounded-full border border-white/15 px-5 py-3 font-black">Withdraw dispute before formal review</button>
              </form>
            ) : null}
          </>
        )}
      </main>
    </PublicShell>
  );
}
