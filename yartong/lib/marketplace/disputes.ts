import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const DISPUTE_CATEGORIES = [
  "WORK_QUALITY",
  "INCOMPLETE_WORK",
  "NO_SHOW",
  "DELAY",
  "SCOPE_DISAGREEMENT",
  "PAYMENT",
  "PROPERTY_DAMAGE",
  "SAFETY",
  "HARASSMENT",
  "FRAUD",
  "OTHER",
] as const;

export const DISPUTE_RESOLUTIONS = [
  "NO_ACTION",
  "MUTUAL_AGREEMENT",
  "REDO_WORK",
  "PARTIAL_REFUND_RECOMMENDED",
  "FULL_REFUND_RECOMMENDED",
  "PAYMENT_RELEASE_RECOMMENDED",
  "ACCOUNT_ACTION",
  "OTHER",
] as const;

export type DisputeCategory = (typeof DISPUTE_CATEGORIES)[number];
export type DisputeResolution = (typeof DISPUTE_RESOLUTIONS)[number];
export type DisputeStatus = "OPEN" | "AWAITING_RESPONSE" | "UNDER_REVIEW" | "RESOLVED" | "CANCELLED";
export type DisputeEventVisibility = "PARTICIPANTS" | "ADMIN_ONLY";

export const DISPUTE_CATEGORY_LABELS: Record<DisputeCategory, string> = {
  WORK_QUALITY: "Work quality",
  INCOMPLETE_WORK: "Incomplete work",
  NO_SHOW: "No-show / abandonment",
  DELAY: "Delay or missed timeline",
  SCOPE_DISAGREEMENT: "Scope disagreement",
  PAYMENT: "Payment disagreement",
  PROPERTY_DAMAGE: "Property damage",
  SAFETY: "Safety concern",
  HARASSMENT: "Harassment or abusive conduct",
  FRAUD: "Fraud or misrepresentation",
  OTHER: "Other",
};

export const DISPUTE_RESOLUTION_LABELS: Record<DisputeResolution, string> = {
  NO_ACTION: "No corrective action",
  MUTUAL_AGREEMENT: "Mutual agreement",
  REDO_WORK: "Work correction / redo agreed",
  PARTIAL_REFUND_RECOMMENDED: "Partial refund recommended",
  FULL_REFUND_RECOMMENDED: "Full refund recommended",
  PAYMENT_RELEASE_RECOMMENDED: "Payment release recommended",
  ACCOUNT_ACTION: "Account / safety action",
  OTHER: "Other resolution",
};

export type ParticipantDispute = {
  id: string;
  engagementId: string;
  openedById: string;
  assignedAdminId: string | null;
  category: DisputeCategory;
  title: string;
  description: string;
  desiredOutcome: string | null;
  status: DisputeStatus;
  previousEngagementStatus: string;
  resolution: DisputeResolution | null;
  resolutionNote: string | null;
  recommendedRefundAmount: number | null;
  openedAt: Date;
  reviewStartedAt: Date | null;
  resolvedAt: Date | null;
  cancelledAt: Date | null;
  jobTitle: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
};

export type DisputeEvent = {
  id: string;
  disputeId: string;
  actorId: string | null;
  actorName: string | null;
  kind: "SYSTEM" | "STATEMENT" | "ADMIN_NOTE" | "STATUS_CHANGE" | "RESOLUTION";
  visibility: DisputeEventVisibility;
  body: string;
  createdAt: Date;
};

export async function getParticipantDisputeByEngagement(userId: string, engagementId: string) {
  const rows = await prisma.$queryRaw<ParticipantDispute[]>(Prisma.sql`
    SELECT d.*, j."title" AS "jobTitle",
      e."customerId", customer."displayName" AS "customerName",
      e."providerId", provider."displayName" AS "providerName"
    FROM "Dispute" d
    JOIN "Engagement" e ON e."id" = d."engagementId"
    JOIN "Job" j ON j."id" = e."jobId"
    JOIN "User" customer ON customer."id" = e."customerId"
    JOIN "User" provider ON provider."id" = e."providerId"
    WHERE d."engagementId" = ${engagementId}
      AND (e."customerId" = ${userId} OR e."providerId" = ${userId})
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function getParticipantDisputeById(userId: string, disputeId: string) {
  const rows = await prisma.$queryRaw<ParticipantDispute[]>(Prisma.sql`
    SELECT d.*, j."title" AS "jobTitle",
      e."customerId", customer."displayName" AS "customerName",
      e."providerId", provider."displayName" AS "providerName"
    FROM "Dispute" d
    JOIN "Engagement" e ON e."id" = d."engagementId"
    JOIN "Job" j ON j."id" = e."jobId"
    JOIN "User" customer ON customer."id" = e."customerId"
    JOIN "User" provider ON provider."id" = e."providerId"
    WHERE d."id" = ${disputeId}
      AND (e."customerId" = ${userId} OR e."providerId" = ${userId})
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function getDisputeEvents(disputeId: string, includeAdminOnly = false) {
  const visibilityFilter = includeAdminOnly
    ? Prisma.empty
    : Prisma.sql`AND de."visibility" = 'PARTICIPANTS'::"DisputeEventVisibility"`;
  return prisma.$queryRaw<DisputeEvent[]>(Prisma.sql`
    SELECT de."id", de."disputeId", de."actorId", u."displayName" AS "actorName",
      de."kind"::text AS "kind", de."visibility"::text AS "visibility", de."body", de."createdAt"
    FROM "DisputeEvent" de
    LEFT JOIN "User" u ON u."id" = de."actorId"
    WHERE de."disputeId" = ${disputeId}
    ${visibilityFilter}
    ORDER BY de."createdAt" ASC
  `);
}

export async function getAdminDispute(disputeId: string) {
  const rows = await prisma.$queryRaw<ParticipantDispute[]>(Prisma.sql`
    SELECT d.*, j."title" AS "jobTitle",
      e."customerId", customer."displayName" AS "customerName",
      e."providerId", provider."displayName" AS "providerName"
    FROM "Dispute" d
    JOIN "Engagement" e ON e."id" = d."engagementId"
    JOIN "Job" j ON j."id" = e."jobId"
    JOIN "User" customer ON customer."id" = e."customerId"
    JOIN "User" provider ON provider."id" = e."providerId"
    WHERE d."id" = ${disputeId}
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function listAdminDisputes() {
  return prisma.$queryRaw<ParticipantDispute[]>(Prisma.sql`
    SELECT d.*, j."title" AS "jobTitle",
      e."customerId", customer."displayName" AS "customerName",
      e."providerId", provider."displayName" AS "providerName"
    FROM "Dispute" d
    JOIN "Engagement" e ON e."id" = d."engagementId"
    JOIN "Job" j ON j."id" = e."jobId"
    JOIN "User" customer ON customer."id" = e."customerId"
    JOIN "User" provider ON provider."id" = e."providerId"
    ORDER BY
      CASE d."status"
        WHEN 'UNDER_REVIEW' THEN 1
        WHEN 'OPEN' THEN 2
        WHEN 'AWAITING_RESPONSE' THEN 3
        WHEN 'RESOLVED' THEN 4
        ELSE 5
      END,
      d."updatedAt" DESC
    LIMIT 200
  `);
}
