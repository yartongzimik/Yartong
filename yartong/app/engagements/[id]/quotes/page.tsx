import { EngagementStatus, QuoteStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";

import {
  respondToEngagementQuoteAction,
  submitEngagementQuoteAction,
  withdrawEngagementQuoteAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function EngagementQuotesPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await prisma.engagement.findFirst({
    where: {
      id,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      status: true,
      currency: true,
      scope: true,
      job: { select: { title: true } },
      quotes: {
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          createdById: true,
          amount: true,
          currency: true,
          scope: true,
          timelineDays: true,
          note: true,
          status: true,
          submittedAt: true,
          respondedAt: true,
        },
      },
    },
  });

  if (!engagement) notFound();

  const isProvider = engagement.providerId === user.id;
  const isCustomer = engagement.customerId === user.id;
  const canNegotiate = engagement.status === EngagementStatus.PENDING;

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Pre-work commercial terms
        </p>
        <h1 className="mt-3 text-4xl font-black">Quotes for {engagement.job.title}</h1>
        <p className="mt-3 text-white/60">
          Quotes can change agreed price, scope and timeline only while the engagement is pending. Once confirmed, terms are locked for this milestone.
        </p>

        {isProvider && canNegotiate ? (
          <form action={submitEngagementQuoteAction.bind(null, engagement.id)} className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <div>
              <label htmlFor="amount" className="font-black">Quote amount (₹)</label>
              <input id="amount" name="amount" type="number" min="1" step="1" required className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            </div>
            <div>
              <label htmlFor="timelineDays" className="font-black">Timeline in days</label>
              <input id="timelineDays" name="timelineDays" type="number" min="1" step="1" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            </div>
            <div>
              <label htmlFor="scope" className="font-black">Quoted scope</label>
              <textarea id="scope" name="scope" rows={6} maxLength={5000} required defaultValue={engagement.scope} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            </div>
            <div>
              <label htmlFor="note" className="font-black">Commercial note</label>
              <textarea id="note" name="note" rows={3} maxLength={2000} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" />
            </div>
            <button className="w-fit rounded-full bg-white px-6 py-3 font-black text-[#14091f]">Submit quote</button>
          </form>
        ) : null}

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black">Quote history</h2>
          {engagement.quotes.length === 0 ? <p className="text-white/55">No formal quotes have been submitted yet.</p> : null}
          {engagement.quotes.map((quote) => (
            <article key={quote.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-black">{formatMoney(quote.amount, quote.currency)}</p>
                  <p className="mt-1 text-sm text-white/50">{quote.timelineDays ? `${quote.timelineDays} days` : "Timeline not specified"}</p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black">{quote.status}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/70">{quote.scope}</p>
              {quote.note ? <p className="mt-3 text-sm text-white/55">Note: {quote.note}</p> : null}

              {isCustomer && canNegotiate && quote.status === QuoteStatus.SUBMITTED ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <form action={respondToEngagementQuoteAction.bind(null, engagement.id, quote.id, "accept")}>
                    <button className="rounded-full bg-emerald-200 px-4 py-2 text-sm font-black text-[#102019]">Accept quote</button>
                  </form>
                  <form action={respondToEngagementQuoteAction.bind(null, engagement.id, quote.id, "reject")}>
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Reject quote</button>
                  </form>
                </div>
              ) : null}

              {isProvider && canNegotiate && quote.createdById === user.id && quote.status === QuoteStatus.SUBMITTED ? (
                <form action={withdrawEngagementQuoteAction.bind(null, engagement.id, quote.id)} className="mt-5">
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Withdraw quote</button>
                </form>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
