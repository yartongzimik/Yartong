"use server";

import {
  ApplicationStatus,
  EngagementStatus,
  JobBudgetType,
  JobStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function setApplicationStatusAction(
  jobId: string,
  applicationId: string,
  nextStatus: ApplicationStatus,
): Promise<void> {
  const customer = await requireRole("CUSTOMER");

  if (
    nextStatus !== ApplicationStatus.SHORTLISTED &&
    nextStatus !== ApplicationStatus.REJECTED
  ) {
    throw new Error("Unsupported application status transition.");
  }

  const result = await prisma.jobApplication.updateMany({
    where: {
      id: applicationId,
      jobId,
      job: { customerId: customer.id, status: JobStatus.PUBLISHED },
      status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
    },
    data: { status: nextStatus },
  });
  if (result.count !== 1) throw new Error("Application status could not be changed.");
  revalidatePath(`/customer/jobs/${jobId}`);
}

export async function acceptApplicationAction(jobId: string, applicationId: string): Promise<void> {
  const customer = await requireRole("CUSTOMER");

  await prisma.$transaction(async (tx) => {
    const candidate = await tx.jobApplication.findFirst({
      where: {
        id: applicationId,
        jobId,
        job: { customerId: customer.id, status: JobStatus.PUBLISHED },
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
      },
      select: {
        id: true,
        providerId: true,
        providerRole: true,
        proposedPrice: true,
        proposedTimelineDays: true,
        job: {
          select: {
            id: true,
            customerId: true,
            description: true,
            budgetType: true,
            budgetMin: true,
            currency: true,
          },
        },
      },
    });

    if (!candidate) throw new Error("This application can no longer be accepted.");

    const accepted = await tx.jobApplication.updateMany({
      where: {
        id: applicationId,
        jobId,
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
      },
      data: { status: ApplicationStatus.ACCEPTED },
    });
    if (accepted.count !== 1) throw new Error("This application can no longer be accepted.");

    const closed = await tx.job.updateMany({
      where: { id: jobId, customerId: customer.id, status: JobStatus.PUBLISHED },
      data: { status: JobStatus.CLOSED, closedAt: new Date() },
    });
    if (closed.count !== 1) throw new Error("This job is no longer open for hiring.");

    const engagement = await tx.engagement.create({
      data: {
        jobId: candidate.job.id,
        applicationId: candidate.id,
        customerId: candidate.job.customerId,
        providerId: candidate.providerId,
        providerRole: candidate.providerRole,
        scope: candidate.job.description,
        agreedPrice:
          candidate.proposedPrice ??
          (candidate.job.budgetType === JobBudgetType.FIXED ? candidate.job.budgetMin : null),
        currency: candidate.job.currency,
        proposedTimelineDays: candidate.proposedTimelineDays,
        status: EngagementStatus.PENDING,
      },
      select: { id: true },
    });

    await tx.conversation.create({
      data: {
        engagementId: engagement.id,
        customerId: candidate.job.customerId,
        providerId: candidate.providerId,
      },
    });

    await tx.jobApplication.updateMany({
      where: {
        jobId,
        id: { not: applicationId },
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
      },
      data: { status: ApplicationStatus.REJECTED },
    });
  });

  revalidatePath(`/customer/jobs/${jobId}`);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/engagements");
  revalidatePath("/messages");
}
