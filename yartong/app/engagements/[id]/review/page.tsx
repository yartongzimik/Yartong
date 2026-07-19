import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { getReviewEligibility } from "@/lib/marketplace/reviews";

import { submitReviewAction } from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function EngagementReviewPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const eligibility = await getReviewEligibility(user.id, id);

  if (!eligibility) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-3xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Verified engagement review
        </p>
        <h1 className="mt-3 text-4xl font-black">Review your experience</h1>
        <p className="mt-3 text-white/60">{eligibility.jobTitle}</p>

        <form
          action={submitReviewAction.bind(null, eligibility.engagementId)}
          className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6"
        >
          <fieldset>
            <legend className="font-black">Rating</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                  <input type="radio" name="rating" value={rating} required />
                  <span>{rating} star{rating === 1 ? "" : "s"}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="title" className="font-black">Review title</label>
            <input
              id="title"
              name="title"
              maxLength={PLATFORM_LIMITS.maximumReviewTitleLength}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-fuchsia-300"
            />
          </div>

          <div>
            <label htmlFor="comment" className="font-black">Comments</label>
            <textarea
              id="comment"
              name="comment"
              rows={6}
              maxLength={PLATFORM_LIMITS.maximumReviewCommentLength}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-fuchsia-300"
            />
          </div>

          <button className="rounded-full bg-white px-6 py-3 font-black text-[#14091f]">
            Publish review
          </button>
        </form>
      </main>
    </PublicShell>
  );
}
