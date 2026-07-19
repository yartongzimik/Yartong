"use server";
import { JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authz";
import { ROUTES } from "@/lib/constants";
import { canTransition, validateJobForm } from "@/lib/jobs/validation";
import { prisma } from "@/lib/prisma";

export async function createJobAction(formData: FormData) {
  const user = await requireRole("CUSTOMER");
  const intent = String(formData.get("intent"));
  const result = await validateJobForm(formData);
  if (!result.ok) return { errors: result.errors };
  const now = new Date();
  const job = await prisma.job.create({ data:{ ...result.data, customerId:user.id, status: intent === "publish" ? "PUBLISHED" : "DRAFT", publishedAt: intent === "publish" ? now : null } });
  revalidatePath(ROUTES.quickJobs); revalidatePath(ROUTES.customerJobs);
  redirect(`${ROUTES.customerJobs}/${job.id}`);
}
export async function updateDraftJobAction(id: string, formData: FormData) {
  const user = await requireRole("CUSTOMER");
  const existing = await prisma.job.findFirst({ where:{ id, customerId:user.id }, select:{ status:true } });
  if (!existing || existing.status !== "DRAFT") return { errors:{ form:"Only your draft jobs can be edited." } };
  const result = await validateJobForm(formData); if (!result.ok) return { errors: result.errors };
  await prisma.job.update({ where:{ id }, data: result.data }); revalidatePath(`${ROUTES.customerJobs}/${id}`); redirect(`${ROUTES.customerJobs}/${id}`);
}
export async function transitionJobAction(id: string, next: JobStatus) {
  const user = await requireRole("CUSTOMER");
  const job = await prisma.job.findFirst({ where:{ id, customerId:user.id }, select:{ status:true, publishedAt:true } });
  if (!job || !canTransition(job.status, next)) redirect(ROUTES.customerJobs);
  const now = new Date();
  await prisma.job.update({ where:{ id }, data:{ status:next, publishedAt: next === "PUBLISHED" ? (job.publishedAt ?? now) : undefined, closedAt: next === "CLOSED" || next === "CANCELLED" ? now : undefined } });
  revalidatePath(ROUTES.quickJobs); revalidatePath(`${ROUTES.customerJobs}/${id}`); redirect(`${ROUTES.customerJobs}/${id}`);
}
