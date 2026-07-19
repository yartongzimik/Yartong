import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { formatMoney } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";

export default async function EngagementsPage() {
  const user = await requireUser();
  const engagements = await prisma.engagement.findMany({
    where: {
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: {
      id: true,
      status: true,
      agreedPrice: true,
      currency: true,
      createdAt: true,
      job: { select: { title: true } },
      customer: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <h1 className="text-4xl font-black">Engagements</h1>
        <p className="mt-3 text-white/65">Accepted hires and active work orders.</p>
        <div className="mt-8 grid gap-4">
          {engagements.map((engagement) => {
            const counterpart =
              engagement.customer.id === user.id
                ? engagement.provider.displayName
                : engagement.customer.displayName;
            return (
              <Link
                key={engagement.id}
                href={`/engagements/${engagement.id}`}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">{engagement.job.title}</h2>
                    <p className="mt-1 text-white/60">With {counterpart}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider">
                    {engagement.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/60">
                  {engagement.agreedPrice == null
                    ? "Price to be agreed"
                    : formatMoney(engagement.agreedPrice, engagement.currency)}
                </p>
              </Link>
            );
          })}
        </div>
        {engagements.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-white/10 p-8 text-white/65">
            No engagements yet. An engagement is created when a customer accepts an application.
          </p>
        ) : null}
      </main>
    </PublicShell>
  );
}