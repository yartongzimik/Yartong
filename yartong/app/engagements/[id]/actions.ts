"use server";

import { EngagementStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function transitionEngagementAction(
  engagementId: string,
  nextStatus: EngagementStatus,
): Promise<void> {
  const user = await requireUser();
  const engagement = await prisma.engagement.findFirst({
    where: {
      id: engagementId,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: {
      status: true,
      customerId: true,
      providerId: true,
    },
  });

  if (!engagement) throw new Error("Engagement not found.");

  const isCustomer = engagement.customerId === user.id;
  const isProvider = engagement.providerId === user.id;

  const allowed =
    (engagement.status === EngagementStatus.PENDING &&
      nextStatus === EngagementStatus.CONFIRMED &&
      isProvider) ||
    (engagement.status === EngagementStatus.CONFIRMED &&
      nextStatus === EngagementStatus.IN_PROGRESS &&
      (isCustomer || isProvider)) ||
    (engagement.status === EngagementStatus.IN_PROGRESS &&
      nextStatus === EngagementStatus.COMPLETED &&
      isCustomer) ||
    ((engagement.status === EngagementStatus.PENDING ||
      engagement.status === EngagementStatus.CONFIRMED) &&
      nextStatus === EngagementStatus.CANCELLED &&
      (isCustomer || isProvider));

  if (!allowed) throw new Error("This engagement transition is not allowed.");

  const now = new Date();
  const updated = await prisma.engagement.updateMany({
    where: {
      id: engagementId,
      status: engagement.status,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    data: {
      status: nextStatus,
      confirmedAt: nextStatus === EngagementStatus.CONFIRMED ? now : undefined,
      startedAt: nextStatus === EngagementStatus.IN_PROGRESS ? now : undefined,
      completedAt: nextStatus === EngagementStatus.COMPLETED ? now : undefined,
      cancelledAt: nextStatus === EngagementStatus.CANCELLED ? now : undefined,
    },
  });

  if (updated.count !== 1) {
    throw new Error("The engagement changed before this action completed. Refresh and try again.");
  }

  revalidatePath("/engagements");
  revalidatePath(`/engagements/${engagementId}`);
}