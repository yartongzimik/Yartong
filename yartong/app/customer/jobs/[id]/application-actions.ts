"use server";

import { ApplicationStatus, JobStatus } from "@prisma/client";
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

export async function acceptApplicationAction(
  jobId: string,
  applicationId: string,
): Promise<void> {
  const customer = await requireRole("CUSTOMER");

  await prisma.$transaction(async (tx) => {
    const application = await tx.jobApplication.findFirst({
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
            currency: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error("This application can no longer be accepted.");
    }

    const accepted = await tx.jobApplication.updateMany({
      where: {
        id: application.id,
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
      },
      data: { status: ApplicationStatus.ACCEPTED },
    });
    if (accepted.count !== 1) {
      throw new Error("This application can no longer be accepted.");
    }

    const closed = await tx.job.updateMany({
      where: {
        id: application.job.id,
        customerId: customer.id,
        status: JobStatus.PUBLISHED,
      },
      data: { status: JobStatus.CLOSED, closedAt: new Date() },
    });
    if (closed.count !== 1) {
      throw new Error("This job is no longer open for hiring.");
    }

    await tx.engagement.create({
      data: {
        applicationId: application.id,
        jobId: application.job.id,
        customerId: application.job.customerId,
        providerId: application.providerId,
        providerRole: application.providerRole,
        scope: application.job.description,
        agreedPrice: application.proposedPrice,
        currency: application.job.currency,
        agreedTimelineDays: application.proposedTimelineDays,
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
}