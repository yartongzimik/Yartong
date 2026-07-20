import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "ORDER"
  | "DISPUTE"
  | "MESSAGE"
  | "ENGAGEMENT"
  | "APPLICATION"
  | "VERIFICATION"
  | "PAYMENT"
  | "SYSTEM";

export type UserNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
}) {
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "Notification" ("id", "userId", "type", "title", "body", "href")
    VALUES (
      ${randomUUID()}, ${input.userId}, ${input.type}::"NotificationType",
      ${input.title.slice(0, 180)}, ${input.body.slice(0, 1000)}, ${input.href?.slice(0, 500) ?? null}
    )
  `);
}

export async function createNotificationWithTx(
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    href?: string | null;
  },
) {
  await tx.$executeRaw(Prisma.sql`
    INSERT INTO "Notification" ("id", "userId", "type", "title", "body", "href")
    VALUES (
      ${randomUUID()}, ${input.userId}, ${input.type}::"NotificationType",
      ${input.title.slice(0, 180)}, ${input.body.slice(0, 1000)}, ${input.href?.slice(0, 500) ?? null}
    )
  `);
}

export async function listUserNotifications(userId: string, limit = 100) {
  return prisma.$queryRaw<UserNotification[]>(Prisma.sql`
    SELECT "id", "type"::text AS "type", "title", "body", "href", "readAt", "createdAt"
    FROM "Notification"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `);
}

export async function countUnreadNotifications(userId: string) {
  const rows = await prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    SELECT COUNT(*) AS "count"
    FROM "Notification"
    WHERE "userId" = ${userId} AND "readAt" IS NULL
  `);
  return Number(rows[0]?.count ?? 0);
}
