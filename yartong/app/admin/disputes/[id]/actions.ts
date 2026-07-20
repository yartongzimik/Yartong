"use server";

import { randomUUID } from "node:crypto";
import { EngagementStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import {
  DISPUTE_RESOLUTIONS,
  type DisputeResolution,
  getAdminDispute,
} from "@/lib/marketplace/disputes";
import { prisma } from "@/lib/prisma";

function text(formData: FormData, key: string, max: number, required = false) {
  const value = String(formData.get(key) ?? "").trim();
  if (required && !value) throw new Error(`${key} is required.`);
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value;
}

function refresh(disputeId: string, engagementId: string) {
  revalidatePath("/admin/disputes");
  revalidatePath(`/admin/disputes/${disputeId}`);
  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/dispute`);
}

export async function moveDisputeToReviewAction(disputeId: string): Promise<void> {
  const admin = await requireRole("ADMIN");
  const dispute = await getAdminDispute(disputeId);
  if (!dispute || !["OPEN", "AWAITING_RESPONSE"].includes(dispute.status)) throw new Error("This case cannot enter review.");

  await prisma.$transaction(async (tx) => {
    const changed = await tx.$executeRaw(Prisma.sql`
      UPDATE "Dispute"
      SET "status" = 'UNDER_REVIEW'::"DisputeStatus", "assignedAdminId" = ${admin.id},
          "reviewStartedAt" = COALESCE("reviewStartedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${disputeId}
        AND "status" IN ('OPEN'::"DisputeStatus", 'AWAITING_RESPONSE'::"DisputeStatus")
    `);
    if (changed !== 1) throw new Error("The dispute changed before review started.");
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${randomUUID()}, ${disputeId}, ${admin.id}, 'STATUS_CHANGE'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", 'Yartong has started formal review of this dispute.')
    `);
  });
  refresh(disputeId, dispute.engagementId);
}

export async function requestMoreInformationAction(disputeId: string, formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const dispute = await getAdminDispute(disputeId);
  if (!dispute || ["RESOLVED", "CANCELLED"].includes(dispute.status)) throw new Error("This case is closed.");
  const note = text(formData, "note", 4000, true);

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw(Prisma.sql`
      UPDATE "Dispute"
      SET "status" = 'AWAITING_RESPONSE'::"DisputeStatus", "assignedAdminId" = ${admin.id}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${disputeId}
    `);
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${randomUUID()}, ${disputeId}, ${admin.id}, 'ADMIN_NOTE'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", ${note})
    `);
  });
  refresh(disputeId, dispute.engagementId);
}

export async function addInternalDisputeNoteAction(disputeId: string, formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const dispute = await getAdminDispute(disputeId);
  if (!dispute) throw new Error("Dispute not found.");
  const note = text(formData, "note", 4000, true);
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
    VALUES (${randomUUID()}, ${disputeId}, ${admin.id}, 'ADMIN_NOTE'::"DisputeEventKind", 'ADMIN_ONLY'::"DisputeEventVisibility", ${note})
  `);
  await prisma.$executeRaw(Prisma.sql`UPDATE "Dispute" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${disputeId}`);
  refresh(disputeId, dispute.engagementId);
}

export async function resolveDisputeAction(disputeId: string, formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const dispute = await getAdminDispute(disputeId);
  if (!dispute || ["RESOLVED", "CANCELLED"].includes(dispute.status)) throw new Error("This dispute is already closed.");

  const resolution = String(formData.get("resolution") ?? "") as DisputeResolution;
  if (!DISPUTE_RESOLUTIONS.includes(resolution)) throw new Error("Select a valid resolution.");
  const resolutionNote = text(formData, "resolutionNote", 4000, true);
  const refundRaw = String(formData.get("recommendedRefundAmount") ?? "").trim();
  const recommendedRefundAmount = refundRaw ? Math.round(Number(refundRaw) * 100) : null;
  if (recommendedRefundAmount !== null && (!Number.isFinite(recommendedRefundAmount) || recommendedRefundAmount < 0)) {
    throw new Error("Recommended refund amount must be zero or greater.");
  }

  const financialResolution = ["PARTIAL_REFUND_RECOMMENDED", "FULL_REFUND_RECOMMENDED"].includes(resolution);
  if (financialResolution && recommendedRefundAmount === null) throw new Error("Enter the recommended refund amount.");
  if (!financialResolution && recommendedRefundAmount !== null) throw new Error("Refund amount is only valid for refund recommendations.");

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findUnique({
      where: { id: dispute.engagementId },
      select: { agreedPrice: true, status: true },
    });
    if (!engagement || engagement.status !== EngagementStatus.DISPUTED) throw new Error("The linked engagement is no longer in dispute state.");
    if (recommendedRefundAmount !== null && engagement.agreedPrice !== null && recommendedRefundAmount > engagement.agreedPrice) {
      throw new Error("Recommended refund cannot exceed the agreed engagement price.");
    }

    const changed = await tx.$executeRaw(Prisma.sql`
      UPDATE "Dispute"
      SET "status" = 'RESOLVED'::"DisputeStatus", "resolution" = ${resolution}::"DisputeResolution",
          "resolutionNote" = ${resolutionNote}, "recommendedRefundAmount" = ${recommendedRefundAmount},
          "assignedAdminId" = ${admin.id}, "resolvedAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${disputeId}
        AND "status" NOT IN ('RESOLVED'::"DisputeStatus", 'CANCELLED'::"DisputeStatus")
    `);
    if (changed !== 1) throw new Error("The dispute changed before it could be resolved.");

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${randomUUID()}, ${disputeId}, ${admin.id}, 'RESOLUTION'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", ${resolutionNote})
    `);

    await tx.engagement.update({
      where: { id: dispute.engagementId },
      data: { status: dispute.previousEngagementStatus as EngagementStatus, disputedAt: null },
    });
  }, { isolationLevel: "Serializable" });

  refresh(disputeId, dispute.engagementId);
}
