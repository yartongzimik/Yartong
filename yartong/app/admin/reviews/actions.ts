"use server";

import { ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = new Set<ReviewStatus>([
  ReviewStatus.PUBLISHED,
  ReviewStatus.FLAGGED,
  ReviewStatus.HIDDEN,
]);

export async function updateReviewStatusAction(
  reviewId: string,
  nextStatus: ReviewStatus,
): Promise<void> {
  await requireRole("ADMIN");

  if (!ALLOWED_STATUSES.has(nextStatus)) {
    throw new Error("Unsupported review moderation status.");
  }

  const result = await prisma.review.updateMany({
    where: { id: reviewId },
    data: { status: nextStatus },
  });

  if (result.count !== 1) {
    throw new Error("Review not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}
