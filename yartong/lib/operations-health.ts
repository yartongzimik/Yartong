import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type OperationsHealthSnapshot = {
  failedMigrations: number;
  unresolvedDisputes: number;
  staleDisputes: number;
  pendingCatalogReview: number;
  failedPaymentOrders: number;
  failedPaymentEvents: number;
  oldUnreadNotifications: number;
  activeRateLimitKeys: number;
  generatedAt: Date;
};

export async function getOperationsHealthSnapshot(): Promise<OperationsHealthSnapshot> {
  const rows = await prisma.$queryRaw<Array<{
    failedMigrations: bigint;
    unresolvedDisputes: bigint;
    staleDisputes: bigint;
    pendingCatalogReview: bigint;
    failedPaymentOrders: bigint;
    failedPaymentEvents: bigint;
    oldUnreadNotifications: bigint;
    activeRateLimitKeys: bigint;
  }>>(Prisma.sql`
    SELECT
      (SELECT COUNT(*) FROM "_prisma_migrations" WHERE finished_at IS NULL AND rolled_back_at IS NULL) AS "failedMigrations",
      (SELECT COUNT(*) FROM "Dispute" WHERE "status" IN ('OPEN'::"DisputeStatus", 'AWAITING_RESPONSE'::"DisputeStatus", 'UNDER_REVIEW'::"DisputeStatus")) AS "unresolvedDisputes",
      (SELECT COUNT(*) FROM "Dispute" WHERE "status" IN ('OPEN'::"DisputeStatus", 'AWAITING_RESPONSE'::"DisputeStatus", 'UNDER_REVIEW'::"DisputeStatus") AND "openedAt" < CURRENT_TIMESTAMP - INTERVAL '7 days') AS "staleDisputes",
      (SELECT COUNT(*) FROM "CatalogProduct" WHERE "status" = 'PENDING_REVIEW'::"CatalogProductStatus") AS "pendingCatalogReview",
      (SELECT COUNT(*) FROM "PaymentOrder" WHERE "status" = 'FAILED'::"PaymentStatus") AS "failedPaymentOrders",
      (SELECT COUNT(*) FROM "PaymentEvent" WHERE "status" = 'FAILED'::"PaymentEventStatus") AS "failedPaymentEvents",
      (SELECT COUNT(*) FROM "Notification" WHERE "readAt" IS NULL AND "createdAt" < CURRENT_TIMESTAMP - INTERVAL '7 days') AS "oldUnreadNotifications",
      (SELECT COUNT(*) FROM "MutationRateLimit" WHERE "resetAt" > CURRENT_TIMESTAMP) AS "activeRateLimitKeys"
  `);

  const row = rows[0];
  return {
    failedMigrations: Number(row?.failedMigrations ?? 0),
    unresolvedDisputes: Number(row?.unresolvedDisputes ?? 0),
    staleDisputes: Number(row?.staleDisputes ?? 0),
    pendingCatalogReview: Number(row?.pendingCatalogReview ?? 0),
    failedPaymentOrders: Number(row?.failedPaymentOrders ?? 0),
    failedPaymentEvents: Number(row?.failedPaymentEvents ?? 0),
    oldUnreadNotifications: Number(row?.oldUnreadNotifications ?? 0),
    activeRateLimitKeys: Number(row?.activeRateLimitKeys ?? 0),
    generatedAt: new Date(),
  };
}

export function operationsHealthSeverity(snapshot: OperationsHealthSnapshot) {
  if (snapshot.failedMigrations > 0) return "critical" as const;
  if (snapshot.failedPaymentEvents > 0 || snapshot.staleDisputes > 0) return "attention" as const;
  return "healthy" as const;
}
