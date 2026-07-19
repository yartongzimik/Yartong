"use server";

import { EngagementStatus, ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function submitReviewAction(
  engagementId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }
  if (title.length > PLATFORM_LIMITS.maximumReviewTitleLength) {
    throw new Error("Review title is too long.");
  }
  if (comment.length > PLATFORM_LIMITS.maximumReviewCommentLength) {
    throw new Error("Review comment is too long.");
  }

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findFirst({
      where: {
        id: engagementId,
        status: EngagementStatus.COMPLETED,
        OR: [{ customerId: user.id }, { providerId: user.id }],
      },
      select: { customerId: true, providerId: true },
    });

    if (!engagement) {
      throw new Error("Only participants in a completed engagement can leave a review.");
    }

    const subjectId =
      engagement.customerId === user.id
        ? engagement.providerId
        : engagement.customerId;

    await tx.review.create({
      data: {
        engagementId,
        authorId: user.id,
        subjectId,
        rating,
        title: title || null,
        comment: comment || null,
        status: ReviewStatus.PUBLISHED,
      },
    });
  });

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath("/workers");
  revalidatePath("/trades");
  redirect(`/engagements/${engagementId}`);
}
