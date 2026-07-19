import { EngagementStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const engagementSelect = {
  id: true,
  status: true,
  scope: true,
  agreedPrice: true,
  currency: true,
  proposedTimelineDays: true,
  confirmedAt: true,
  startedAt: true,
  completedAt: true,
  cancelledAt: true,
  disputedAt: true,
  createdAt: true,
  updatedAt: true,
  customerId: true,
  providerId: true,
  providerRole: true,
  customer: { select: { id: true, displayName: true } },
  provider: { select: { id: true, displayName: true } },
  job: {
    select: {
      id: true,
      title: true,
      category: true,
      location: { select: { name: true, state: true } },
    },
  },
  application: {
    select: {
      id: true,
      message: true,
      proposedPrice: true,
      proposedTimelineDays: true,
    },
  },
} satisfies Prisma.EngagementSelect;

export type EngagementRecord = Prisma.EngagementGetPayload<{
  select: typeof engagementSelect;
}>;

export function engagementStatusLabel(status: EngagementStatus): string {
  switch (status) {
    case EngagementStatus.PENDING:
      return "Pending confirmation";
    case EngagementStatus.CONFIRMED:
      return "Confirmed";
    case EngagementStatus.IN_PROGRESS:
      return "In progress";
    case EngagementStatus.COMPLETED:
      return "Completed";
    case EngagementStatus.CANCELLED:
      return "Cancelled";
    case EngagementStatus.DISPUTED:
      return "Disputed";
  }
}

export async function getUserEngagements(userId: string) {
  return prisma.engagement.findMany({
    where: { OR: [{ customerId: userId }, { providerId: userId }] },
    select: engagementSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserEngagement(userId: string, engagementId: string) {
  return prisma.engagement.findFirst({
    where: {
      id: engagementId,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: engagementSelect,
  });
}
