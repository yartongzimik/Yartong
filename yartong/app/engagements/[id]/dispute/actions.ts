"use server";

import { randomUUID } from "node:crypto";
import { EngagementStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import {
  DISPUTE_CATEGORIES,
  type DisputeCategory,
  getParticipantDisputeById,
} from "@/lib/marketplace/disputes";
import { createNotificationWithTx } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { enforceMutationRateLimit } from "@/lib/rate-limit";

const ELIGIBLE_STATUSES: EngagementStatus[] = [
  EngagementStatus.CONFIRMED,
  EngagementStatus.IN_PROGRESS,
  EngagementStatus.COMPLETED,
];

function requiredText(formData: FormData, key: string, max: number) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required.`);
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value;
}

export async function openDisputeAction(engagementId: string, formData: FormData): Promise<void> {
  const user = await requireUser();
  await enforceMutationRateLimit({ actorId: user.id, action: "open-dispute", limit: 5, windowSeconds: 3600 });

  const category = String(formData.get("category") ?? "") as DisputeCategory;
  if (!DISPUTE_CATEGORIES.includes(category)) throw new Error("Select a valid dispute category.");

  const title = requiredText(formData, "title", 160);
  const description = requiredText(formData, "description", 4000);
  const desiredOutcomeRaw = String(formData.get("desiredOutcome") ?? "").trim();
  const desiredOutcome = desiredOutcomeRaw ? desiredOutcomeRaw.slice(0, 2000) : null;
  const disputeId = randomUUID();
  const eventId = randomUUID();

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findFirst({
      where: {
        id: engagementId,
        OR: [{ customerId: user.id }, { providerId: user.id }],
        status: { in: ELIGIBLE_STATUSES },
      },
      select: { id: true, status: true, customerId: true, providerId: true },
    });
    if (!engagement) throw new Error("This engagement is not eligible for a dispute.");

    const existing = await tx.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "Dispute" WHERE "engagementId" = ${engagementId} LIMIT 1
    `);
    if (existing.length) throw new Error("A dispute already exists for this engagement.");

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "Dispute" (
        "id", "engagementId", "openedById", "category", "title", "description",
        "desiredOutcome", "status", "previousEngagementStatus", "updatedAt"
      ) VALUES (
        ${disputeId}, ${engagementId}, ${user.id}, ${category}::"DisputeCategory", ${title}, ${description},
        ${desiredOutcome}, 'OPEN'::"DisputeStatus", ${engagement.status}::"EngagementStatus", CURRENT_TIMESTAMP
      )
    `);

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${eventId}, ${disputeId}, ${user.id}, 'SYSTEM'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", 'Dispute opened. Both participants can add statements while Yartong reviews the case.')
    `);

    await tx.engagement.update({
      where: { id: engagementId },
      data: { status: EngagementStatus.DISPUTED, disputedAt: new Date() },
    });

    const counterpartId = engagement.customerId === user.id ? engagement.providerId : engagement.customerId;
    await createNotificationWithTx(tx, {
      userId: counterpartId,
      type: "DISPUTE",
      title: "A dispute was opened",
      body: title,
      href: `/engagements/${engagementId}/dispute`,
    });
  }, { isolationLevel: "Serializable" });

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/dispute`);
  revalidatePath("/admin/disputes");
  revalidatePath("/notifications");
}

export async function addDisputeStatementAction(disputeId: string, formData: FormData): Promise<void> {
  const user = await requireUser();
  await enforceMutationRateLimit({ actorId: user.id, action: "dispute-statement", limit: 12, windowSeconds: 300 });

  const dispute = await getParticipantDisputeById(user.id, disputeId);
  if (!dispute || dispute.status === "RESOLVED" || dispute.status === "CANCELLED") {
    throw new Error("This dispute is no longer accepting participant statements.");
  }
  const body = requiredText(formData, "body", 4000);

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findUnique({
      where: { id: dispute.engagementId },
      select: { customerId: true, providerId: true },
    });
    if (!engagement) throw new Error("The linked engagement no longer exists.");

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${randomUUID()}, ${disputeId}, ${user.id}, 'STATEMENT'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", ${body})
    `);

    await tx.$executeRaw(Prisma.sql`
      UPDATE "Dispute" SET "updatedAt" = CURRENT_TIMESTAMP,
        "status" = CASE WHEN "status" = 'OPEN'::"DisputeStatus" THEN 'AWAITING_RESPONSE'::"DisputeStatus" ELSE "status" END
      WHERE "id" = ${disputeId}
    `);

    const counterpartId = engagement.customerId === user.id ? engagement.providerId : engagement.customerId;
    await createNotificationWithTx(tx, {
      userId: counterpartId,
      type: "DISPUTE",
      title: "New dispute statement",
      body: body.length > 180 ? `${body.slice(0, 177)}…` : body,
      href: `/engagements/${dispute.engagementId}/dispute`,
    });
  });

  revalidatePath(`/engagements/${dispute.engagementId}/dispute`);
  revalidatePath("/admin/disputes");
  revalidatePath("/notifications");
}

export async function withdrawDisputeAction(disputeId: string): Promise<void> {
  const user = await requireUser();
  const dispute = await getParticipantDisputeById(user.id, disputeId);
  if (!dispute || dispute.openedById !== user.id || !["OPEN", "AWAITING_RESPONSE"].includes(dispute.status)) {
    throw new Error("This dispute cannot be withdrawn.");
  }

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findUnique({
      where: { id: dispute.engagementId },
      select: { customerId: true, providerId: true },
    });
    if (!engagement) throw new Error("The linked engagement no longer exists.");

    const changed = await tx.$executeRaw(Prisma.sql`
      UPDATE "Dispute"
      SET "status" = 'CANCELLED'::"DisputeStatus", "cancelledAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${disputeId} AND "openedById" = ${user.id}
        AND "status" IN ('OPEN'::"DisputeStatus", 'AWAITING_RESPONSE'::"DisputeStatus")
    `);
    if (changed !== 1) throw new Error("This dispute can no longer be withdrawn.");

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "DisputeEvent" ("id", "disputeId", "actorId", "kind", "visibility", "body")
      VALUES (${randomUUID()}, ${disputeId}, ${user.id}, 'STATUS_CHANGE'::"DisputeEventKind", 'PARTICIPANTS'::"DisputeEventVisibility", 'The dispute was withdrawn before formal review.')
    `);

    await tx.engagement.update({
      where: { id: dispute.engagementId },
      data: { status: dispute.previousEngagementStatus as EngagementStatus, disputedAt: null },
    });

    const counterpartId = engagement.customerId === user.id ? engagement.providerId : engagement.customerId;
    await createNotificationWithTx(tx, {
      userId: counterpartId,
      type: "DISPUTE",
      title: "Dispute withdrawn",
      body: "The dispute was withdrawn before formal review.",
      href: `/engagements/${dispute.engagementId}/dispute`,
    });
  });

  revalidatePath(`/engagements/${dispute.engagementId}`);
  revalidatePath(`/engagements/${dispute.engagementId}/dispute`);
  revalidatePath("/admin/disputes");
  revalidatePath("/notifications");
}
