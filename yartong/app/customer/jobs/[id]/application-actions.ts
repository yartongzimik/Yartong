"use server";

import { ApplicationStatus, JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function setApplicationStatusAction(
  jobId: string,
  applicationId: string,
  nextStatus: ApplicationStatus.SHORTLISTED | ApplicationStatus.REJECTED,
): Promise<void> {
  const customer = await requireRole("CUSTOMER");
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
    const accepted = await tx.jobApplication.updateMany({
      where: {
        id: applicationId,
        jobId,
        job: { customerId: customer.id, status: JobStatus.PUBLISHED },
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
}