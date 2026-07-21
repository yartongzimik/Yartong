import { ReviewStatus } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { prisma } from "@/lib/prisma";

import { updateReviewStatusAction } from "./actions";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(value);
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      status: true,
      createdAt: true,
      author: { select: { displayName: true, email: true } },
      subject: { select: { displayName: true, email: true } },
      engagement: { select: { job: { select: { title: true } } } },
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-10 text-white sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">Trust and safety</p>
        <h1 className="mt-3 text-4xl font-black">Review moderation</h1>
        <p className="mt-3 max-w-3xl leading-7 text-white/60">
          Flag reviews for investigation, hide content that violates marketplace rules, or restore legitimate completed-engagement feedback.
        </p>

        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">{review.engagement.job.title}</p>
                  <h2 className="mt-2 text-xl font-black">{review.title || `${review.rating}/5 review`}</h2>
                  <p className="mt-2 text-sm text-white/50">
                    By {review.author.displayName || review.author.email || "Unknown author"} for {review.subject.displayName || review.subject.email || "Unknown recipient"} · {formatDate(review.createdAt)}
                  </p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black">{review.status}</span>
              </div>
              <p className="mt-5 whitespace-pre-wrap leading-7 text-white/70">{review.comment || "No written comment."}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {review.status !== ReviewStatus.PUBLISHED ? <form action={updateReviewStatusAction.bind(null, review.id, ReviewStatus.PUBLISHED)}><button className="rounded-full border border-emerald-200/25 bg-emerald-200/10 px-4 py-2 text-sm font-bold text-emerald-50">Publish</button></form> : null}
                {review.status !== ReviewStatus.FLAGGED ? <form action={updateReviewStatusAction.bind(null, review.id, ReviewStatus.FLAGGED)}><button className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-sm font-bold text-amber-50">Flag</button></form> : null}
                {review.status !== ReviewStatus.HIDDEN ? <form action={updateReviewStatusAction.bind(null, review.id, ReviewStatus.HIDDEN)}><button className="rounded-full border border-rose-200/25 bg-rose-200/10 px-4 py-2 text-sm font-bold text-rose-50">Hide</button></form> : null}
              </div>
            </article>
          ))}
          {!reviews.length ? <p className="rounded-3xl border border-white/10 p-8 text-white/50">No reviews have been submitted yet.</p> : null}
        </div>
      </main>
    </PublicShell>
  );
}
