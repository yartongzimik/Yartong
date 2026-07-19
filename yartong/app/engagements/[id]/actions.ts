"use server";

import { EngagementStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const PROVIDER_ROLES = new Set<UserRole>([
  UserRole.SKILLED_PROVIDER,
  UserRole.LABOURER,
  UserRole.CONTRACTOR,
]);

function revalidateEngagement(engagementId: string) {
  revalidatePath("/engagements");
  revalidatePath(`/engagements/${engagementId}`);
}

export async function confirmEngagementAction(engagementId: string): Promise<void> {
  const user = await requireUser();
  if (!PROVIDER_ROLES.has(user.primaryRole)) throw new Error("Only the hired provider can confirm this engagement.");

  const result = await prisma.engagement.updateMany({
    where: {
      id: engagementId,
      providerId: user.id,
      status: EngagementStatus.PENDING,
    },
    data: {
      status: EngagementStatus.CONFIRMED,
      confirmedAt: new Date(),
    },
  });

  if (result.count !== 1) throw new Error("This engagement can no longer be confirmed.");
  revalidateEngagement(engagementId);
}

export async function startEngagementAction(engagementId: string): Promise<void> {
  const user = await requireUser();
  if (!PROVIDER_ROLES.has(user.primaryRole)) throw new Error("Only the hired provider can start this engagement.");

  const result = await prisma.engagement.updateMany({
    where: {
      id: engagementId,
      providerId: user.id,
      status: EngagementStatus.CONFIRMED,
    },
    data: {
      status: EngagementStatus.IN_PROGRESS,
      startedAt: new Date(),
    },
  });

  if (result.count !== 1) throw new Error("This engagement can no longer be started.");
  revalidateEngagement(engagementId);
}

export async function completeEngagementAction(engagementId: string): Promise<void> {
  const user = await requireUser();
  if (user.primaryRole !== UserRole.CUSTOMER) throw new Error("Only the customer can complete this engagement.");

  const result = await prisma.engagement.updateMany({
    where: {
      id: engagementId,
      customerId: user.id,
      status: EngagementStatus.IN_PROGRESS,
    },
    data: {
      status: EngagementStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  if (result.count !== 1) throw new Error("This engagement can no longer be completed.");
  revalidateEngagement(engagementId);
}

export async function cancelEngagementAction(engagementId: string): Promise<void> {
  const user = await requireUser();

  const result = await prisma.engagement.updateMany({
    where: {
      id: engagementId,
      OR: [{ customerId: user.id }, { providerId: user.id }],
      status: { in: [EngagementStatus.PENDING, EngagementStatus.CONFIRMED] },
    },
    data: {
      status: EngagementStatus.CANCELLED,
      cancelledAt: new Date(),
    },
  });

  if (result.count !== 1) throw new Error("This engagement can no longer be cancelled.");
  revalidateEngagement(engagementId);
}
