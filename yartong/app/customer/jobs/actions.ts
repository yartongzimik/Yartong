"use server";

import { JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/authz";
import { ROUTES } from "@/lib/constants";
import { canTransition, validateJobForm } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";

export async function createJobAction(formData: FormData): Promise<void> {
  const user = await requireRole("CUSTOMER");
  const intent = String(formData.get("intent"));
  const result = await validateJobForm(formData);

  if (!result.ok) {
    redirect(`${ROUTES.postJob}?error=invalid-job`);
  }

  const now = new Date();
  const publish = intent === "publish";
  const job = await prisma.job.create({
    data: {
      ...result.data,
      customerId: user.id,
      status: publish ? JobStatus.PUBLISHED : JobStatus.DRAFT,
      publishedAt: publish ? now : null,
    },
  });

  revalidatePath(ROUTES.quickJobs);
  revalidatePath(ROUTES.customerJobs);
  redirect(`${ROUTES.customerJobs}/${job.id}`);
}

export async function updateDraftJobAction(
  id: string,
  formData: FormData,
): Promise<void> {
  const user = await requireRole("CUSTOMER");
  const result = await validateJobForm(formData);

  if (!result.ok) {
    redirect(`${ROUTES.customerJobs}/${id}/edit?error=invalid-job`);
  }

  const updated = await prisma.job.updateMany({
    where: {
      id,
      customerId: user.id,
      status: JobStatus.DRAFT,
    },
    data: result.data,
  });

  if (updated.count !== 1) {
    redirect(ROUTES.customerJobs);
  }

  revalidatePath(`${ROUTES.customerJobs}/${id}`);
  revalidatePath(ROUTES.customerJobs);
  redirect(`${ROUTES.customerJobs}/${id}`);
}

export async function transitionJobAction(
  id: string,
  next: JobStatus,
): Promise<void> {
  const user = await requireRole("CUSTOMER");
  const job = await prisma.job.findFirst({
    where: { id, customerId: user.id },
    select: { status: true, publishedAt: true },
  });

  if (!job || !canTransition(job.status, next)) {
    redirect(ROUTES.customerJobs);
  }

  const now = new Date();
  const updated = await prisma.job.updateMany({
    where: {
      id,
      customerId: user.id,
      status: job.status,
    },
    data: {
      status: next,
      publishedAt:
        next === JobStatus.PUBLISHED ? (job.publishedAt ?? now) : undefined,
      closedAt:
        next === JobStatus.CLOSED || next === JobStatus.CANCELLED
          ? now
          : undefined,
    },
  });

  if (updated.count !== 1) {
    redirect(`${ROUTES.customerJobs}/${id}`);
  }

  revalidatePath(ROUTES.quickJobs);
  revalidatePath(`${ROUTES.customerJobs}/${id}`);
  revalidatePath(ROUTES.customerJobs);
  redirect(`${ROUTES.customerJobs}/${id}`);
}
