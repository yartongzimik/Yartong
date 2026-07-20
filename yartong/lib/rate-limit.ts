import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function enforceMutationRateLimit(input: {
  actorId: string;
  action: string;
  limit: number;
  windowSeconds: number;
}) {
  const key = `${input.action}:${input.actorId}`;
  const resetAt = new Date(Date.now() + input.windowSeconds * 1000);

  const rows = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>(Prisma.sql`
    INSERT INTO "MutationRateLimit" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${resetAt}, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "MutationRateLimit"."resetAt" <= CURRENT_TIMESTAMP THEN 1
        ELSE "MutationRateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "MutationRateLimit"."resetAt" <= CURRENT_TIMESTAMP THEN ${resetAt}
        ELSE "MutationRateLimit"."resetAt"
      END,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "count", "resetAt"
  `);

  const state = rows[0];
  if (state && state.count > input.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((state.resetAt.getTime() - Date.now()) / 1000),
    );
    throw new Error(`Too many requests. Please try again in ${retryAfterSeconds} seconds.`);
  }
}
