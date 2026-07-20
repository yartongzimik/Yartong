import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireRole } from "@/lib/authz";
import {
  DISPUTE_CATEGORY_LABELS,
  DISPUTE_RESOLUTIONS,
  DISPUTE_RESOLUTION_LABELS,
  getAdminDispute,
  getDisputeEvents,
} from "@/lib/marketplace/disputes";

import {
  addInternalDisputeNoteAction,
  moveDisputeToReviewAction,
  requestMoreInformationAction,
  resolveDisputeAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function AdminDisputeDetailPage({ params }: Props) {
  await requireRole("ADMIN");
  const { id } = await params;
  const dispute = await getAdminDispute(id);
  if (!dispute) notFound();
  const events = await getDisputeEvents(id, true);
  const closed = ["RESOLVED", "CANCELLED"].includes(dispute.status);

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <Link href="/admin/disputes" className="text-sm font-bold text-fuchsia-200">← Back to dispute queue</Link>
        <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-200/70">{dispute.status.replaceAll("_", " ")} · {DISPUTE_CATEGORY_LABELS[dispute.category]}</p>
            <h1 className="mt-3 text-4xl font-black">{dispute.title}</h1>
            <p className="mt-2 text-white/55">{dispute.jobTitle}</p>
          </div>
          {!closed && ["OPEN", "AWAITING_RESPONSE"].includes(dispute.status) ? (
            <form action={moveDisputeToReviewAction.bind(null, dispute.id)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Start formal review</button>
            </form>
          ) : null}
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <h2 className="font-black">Case summary</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/70">{dispute.description}</p>
            {dispute.desiredOutcome ? <p className="mt-4 rounded-2xl bg-white/[0.05] p-4 text-sm text-white/65"><strong className="text-white">Requested outcome:</strong> {dispute.desiredOutcome}</p> : null}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-sm text-white/65">
            <h2 className="font-black text-white">Participants</h2>
            <p className="mt-4">Customer: <strong className="text-white">{dispute.customerName}</strong></p>
            <p className="mt-2">Provider: <strong className="text-white">{dispute.providerName}</strong></p>
            <p className="mt-4">Previous engagement state: <strong className="text-white">{dispute.previousEngagementStatus.replaceAll("_", " ")}</strong></p>
            <p className="mt-2">Opened: <strong className="text-white">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(dispute.openedAt)}</strong></p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Complete case record</h2>
          <div className="mt-5 space-y-4">
            {events.map((event) => (
              <article key={event.id} className={`rounded-2xl border p-4 ${event.visibility === "ADMIN_ONLY" ? "border-amber-200/20 bg-amber-200/5" : "border-white/10"}`}>
                <div className="flex flex-wrap justify-between gap-2 text-xs text-white/45">
                  <span>{event.actorName || "Yartong"} · {event.kind.replaceAll("_", " ")} · {event.visibility === "ADMIN_ONLY" ? "INTERNAL" : "SHARED"}</span>
                  <time>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(event.createdAt)}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">{event.body}</p>
              </article>
            ))}
          </div>
        </section>

        {!closed ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <form action={requestMoreInformationAction.bind(null, dispute.id)} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-black">Request information / shared guidance</h2>
              <textarea name="note" required maxLength={4000} rows={5} className="mt-3 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="This message is visible to both participants." />
              <button className="mt-4 rounded-full border border-white/15 px-5 py-3 font-black">Send shared case note</button>
            </form>

            <form action={addInternalDisputeNoteAction.bind(null, dispute.id)} className="rounded-3xl border border-amber-200/15 bg-amber-200/5 p-6">
              <h2 className="font-black">Internal operations note</h2>
              <textarea name="note" required maxLength={4000} rows={5} className="mt-3 w-full rounded-2xl border border-amber-200/15 bg-black/10 px-4 py-3" placeholder="Visible only to Yartong administrators. Do not store credentials or unnecessary sensitive data." />
              <button className="mt-4 rounded-full border border-amber-200/20 px-5 py-3 font-black text-amber-50">Save internal note</button>
            </form>
          </div>
        ) : null}

        {!closed ? (
          <form action={resolveDisputeAction.bind(null, dispute.id)} className="mt-6 rounded-3xl border border-emerald-200/20 bg-emerald-200/[0.06] p-6">
            <h2 className="text-2xl font-black">Resolve case</h2>
            <p className="mt-2 text-sm text-emerald-50/65">Record a clear operational outcome. Refund recommendations are audit records only and do not mutate payment-provider state.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold" htmlFor="resolution">Resolution</label>
                <select id="resolution" name="resolution" required className="mt-2 w-full rounded-2xl border border-white/15 bg-[#120b1d] px-4 py-3">
                  {DISPUTE_RESOLUTIONS.map((value) => <option key={value} value={value}>{DISPUTE_RESOLUTION_LABELS[value]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold" htmlFor="recommendedRefundAmount">Recommended refund (₹, only for refund outcomes)</label>
                <input id="recommendedRefundAmount" name="recommendedRefundAmount" type="number" min="0" step="0.01" className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-sm font-bold" htmlFor="resolutionNote">Decision and reasoning</label>
              <textarea id="resolutionNote" name="resolutionNote" required maxLength={4000} rows={6} className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3" placeholder="Explain the evidence considered, the decision, what each participant should do next, and any operational follow-up." />
            </div>
            <button className="mt-5 rounded-full bg-emerald-100 px-6 py-3 font-black text-emerald-950">Record final resolution</button>
          </form>
        ) : (
          <section className="mt-6 rounded-3xl border border-emerald-200/20 bg-emerald-200/10 p-6 text-emerald-50">
            <h2 className="font-black">Case closed</h2>
            {dispute.resolution ? <p className="mt-2">{DISPUTE_RESOLUTION_LABELS[dispute.resolution]}</p> : null}
            {dispute.resolutionNote ? <p className="mt-3 text-sm text-emerald-50/75">{dispute.resolutionNote}</p> : null}
          </section>
        )}
      </main>
    </PublicShell>
  );
}
