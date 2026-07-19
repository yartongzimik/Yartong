import { EngagementStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import {
  engagementStatusLabel,
  getUserEngagement,
} from "@/lib/marketplace/engagements";
import { getReviewEligibility } from "@/lib/marketplace/reviews";

import {
  cancelEngagementAction,
  completeEngagementAction,
  confirmEngagementAction,
  startEngagementAction,
} from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function EngagementDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await getUserEngagement(user.id, id);

  if (!engagement) notFound();

  const isCustomer = engagement.customerId === user.id;
  const isProvider = engagement.providerId === user.id;
  const reviewEligibility =
    engagement.status === EngagementStatus.COMPLETED
      ? await getReviewEligibility(user.id, engagement.id)
      : null;

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          {engagementStatusLabel(engagement.status)}
        </p>
        <h1 className="mt-4 text-4xl font-black">{engagement.job.title}</h1>
        <p className="mt-3 text-white/65">
          {engagement.job.location.name}, {engagement.job.location.state}
        </p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-2xl font-black">Agreed work scope</h2>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-white/75">{engagement.scope}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-white/50">Customer</dt>
              <dd className="font-bold">{engagement.customer.displayName}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">Provider</dt>
              <dd className="font-bold">{engagement.provider.displayName}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">Agreed price</dt>
              <dd className="font-bold">
                {engagement.agreedPrice == null
                  ? "To be finalized"
                  : formatMoney(engagement.agreedPrice, engagement.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">Proposed timeline</dt>
              <dd className="font-bold">
                {engagement.proposedTimelineDays == null
                  ? "Not specified"
                  : `${engagement.proposedTimelineDays} day${engagement.proposedTimelineDays === 1 ? "" : "s"}`}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          {engagement.status === EngagementStatus.PENDING ? (
            <Link
              href={`/engagements/${engagement.id}/quotes`}
              className="rounded-full border border-fuchsia-200/25 bg-fuchsia-200/10 px-5 py-3 font-black text-fuchsia-100"
            >
              Review quotes & terms
            </Link>
          ) : null}

          {isProvider && engagement.status === EngagementStatus.PENDING ? (
            <form action={confirmEngagementAction.bind(null, engagement.id)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">
                Confirm engagement
              </button>
            </form>
          ) : null}

          {isProvider && engagement.status === EngagementStatus.CONFIRMED ? (
            <form action={startEngagementAction.bind(null, engagement.id)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">
                Mark work started
              </button>
            </form>
          ) : null}

          {isCustomer && engagement.status === EngagementStatus.IN_PROGRESS ? (
            <form action={completeEngagementAction.bind(null, engagement.id)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">
                Mark work completed
              </button>
            </form>
          ) : null}

          {(isCustomer || isProvider) &&
          (engagement.status === EngagementStatus.PENDING ||
            engagement.status === EngagementStatus.CONFIRMED) ? (
            <form action={cancelEngagementAction.bind(null, engagement.id)}>
              <button className="rounded-full border border-white/15 px-5 py-3 font-black">
                Cancel engagement
              </button>
            </form>
          ) : null}

          {reviewEligibility ? (
            <Link
              href={`/engagements/${engagement.id}/review`}
              className="rounded-full bg-fuchsia-200 px-5 py-3 font-black text-[#14091f]"
            >
              Leave a verified review
            </Link>
          ) : null}
        </div>

        {engagement.status === EngagementStatus.DISPUTED ? (
          <p className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            Formal dispute handling will be implemented in the dedicated disputes milestone.
          </p>
        ) : null}
      </main>
    </PublicShell>
  );
}
