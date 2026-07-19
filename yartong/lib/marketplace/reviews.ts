import { EngagementStatus, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getReviewEligibility(userId: string, engagementId: string) {
  const engagement = await prisma.engagement.findFirst({
    where: {
      id: engagementId,
      status: EngagementStatus.COMPLETED,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      job: { select: { title: true } },
      reviews: {
        where: { authorId: userId },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!engagement || engagement.reviews.length > 0) return null;

  return {
    engagementId: engagement.id,
    jobTitle: engagement.job.title,
    subjectId:
      engagement.customerId === userId
        ? engagement.providerId
        : engagement.customerId,
  };
}

export async function getPublicProviderReputation(providerId: string) {
  const [aggregate, reviews] = await prisma.$transaction([
    prisma.review.aggregate({
      where: { subjectId: providerId, status: ReviewStatus.PUBLISHED },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.review.findMany({
      where: { subjectId: providerId, status: ReviewStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        author: { select: { displayName: true } },
      },
    }),
  ]);

  return {
    averageRating: aggregate._avg.rating ?? null,
    reviewCount: aggregate._count.rating,
    reviews,
  };
}
