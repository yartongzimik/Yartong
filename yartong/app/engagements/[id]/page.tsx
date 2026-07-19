import { EngagementStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";

import { transitionEngagementAction } from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function EngagementDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const engagement = await prisma.engagement.findFirst({
    where: {
      id,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: {
      id: true,
      status: true,
      scope: true,
      agreedPrice: true,
      currency: true,
      agreedTimelineDays: true,
      customerId: true,
      providerId: true,
      confirmedAt: true,
      startedAt: true,
      completedAt: true,
      cancelledAt: true,
      job: {
        select: {
          id: true,
          title: true,
          location: { select: { name: true, state: true } },
        },
      },
      customer: { select: { displayName: true } },
      provider: { select: { displayName: true } },
    },
  });

  if (!engagement) notFound();

  const isCustomer = engagement.customerId === user.id;
  const isProvider = engagement.providerId === user.id;

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider">
          {engagement.status.replaceAll("_", " ")}
        </span>
        <h1 className="mt-4 text-5xl font-black">{engagement.job.title}</h1>
        <p className="mt-3 text-white/60">
          {engagement.job.location.name}, {engagement.job.location.state}
        </p>
        <div className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <div>
            <p className="text-sm text-white/50">Customer</p>
            <p className="font-bold">{engagement.customer.displayName}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Provider</p>
            <p className="font-bold">{engagement.provider.displayName}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Agreed scope</p>
            <p className="whitespace-pre-wrap leading-7 text-white/75">{engagement.scope}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">Agreed price</p>
            <p className="font-bold">
              {engagement.agreedPrice == null
                ? "Not specified in application"
                : formatMoney(engagement.agreedPrice, engagement.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/50">Timeline</p>
            <p className="font-bold">
              {engagement.agreedTimelineDays == null
                ? "Not specified"
                : `${engagement.agreedTimelineDays} day${engagement.agreedTimelineDays === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {engagement.status === EngagementStatus.PENDING && isProvider ? (
            <form action={transitionEngagementAction.bind(null, id, EngagementStatus.CONFIRMED)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Confirm engagement</button>
            </form>
          ) : null}
          {engagement.status === EngagementStatus.CONFIRMED && (isCustomer || isProvider) ? (
            <form action={transitionEngagementAction.bind(null, id, EngagementStatus.IN_PROGRESS)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Start work</button>
            </form>
          ) : null}
          {engagement.status === EngagementStatus.IN_PROGRESS && isCustomer ? (
            <form action={transitionEngagementAction.bind(null, id, EngagementStatus.COMPLETED)}>
              <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">Mark completed</button>
            </form>
          ) : null}
          {(engagement.status === EngagementStatus.PENDING || engagement.status === EngagementStatus.CONFIRMED) ? (
            <form action={transitionEngagementAction.bind(null, id, EngagementStatus.CANCELLED)}>
              <button className="rounded-full border border-white/15 px-5 py-3 font-black">Cancel engagement</button>
            </form>
          ) : null}
        </div>

        <p className="mt-8 text-sm text-white/50">
          Messaging, payments, reviews and formal disputes are intentionally handled in later milestones.
        </p>
      </main>
    </PublicShell>
  );
}