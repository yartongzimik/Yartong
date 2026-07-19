"use server";

import { ApplicationStatus, JobProviderRole, JobStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const ROLE_MAP: Partial<Record<UserRole, JobProviderRole>> = {
  [UserRole.SKILLED_PROVIDER]: JobProviderRole.SKILLED_PROVIDER,
  [UserRole.LABOURER]: JobProviderRole.LABOURER,
  [UserRole.CONTRACTOR]: JobProviderRole.CONTRACTOR,
};

function optionalPositiveInt(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const parsed = Number(text);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error("Enter a positive whole number.");
  return parsed;
}

export async function applyToJobAction(jobId: string, formData: FormData): Promise<void> {
  const user = await requireUser();
  const providerRole = ROLE_MAP[user.primaryRole];
  if (!providerRole) throw new Error("Only skilled providers, labourers, and contractors can apply.");

  const message = String(formData.get("message") ?? "").trim();
  if (!message || message.length > 2000) throw new Error("Application message must be between 1 and 2000 characters.");

  const proposedRupees = optionalPositiveInt(formData.get("proposedPrice"));
  const proposedPrice = proposedRupees === null ? null : proposedRupees * 100;
  const proposedTimelineDays = optionalPositiveInt(formData.get("proposedTimelineDays"));

  const job = await prisma.job.findFirst({
    where: { id: jobId, status: JobStatus.PUBLISHED, targetProviderRoles: { has: providerRole } },
    select: { id: true },
  });
  if (!job) throw new Error("This job is not open to your provider role.");

  await prisma.jobApplication.create({
    data: { jobId, providerId: user.id, providerRole, message, proposedPrice, proposedTimelineDays },
  });

  revalidatePath(`/jobs/${jobId}`);
  redirect("/applications");
}

export async function withdrawApplicationAction(applicationId: string): Promise<void> {
  const user = await requireUser();
  const result = await prisma.jobApplication.updateMany({
    where: {
      id: applicationId,
      providerId: user.id,
      status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
    },
    data: { status: ApplicationStatus.WITHDRAWN },
  });
  if (result.count !== 1) throw new Error("This application can no longer be withdrawn.");
  revalidatePath("/applications");
}