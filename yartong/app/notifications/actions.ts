"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(notificationId: string): Promise<void> {
  const user = await requireUser();
  await prisma.$executeRaw(Prisma.sql`
    UPDATE "Notification"
    SET "readAt" = COALESCE("readAt", CURRENT_TIMESTAMP)
    WHERE "id" = ${notificationId} AND "userId" = ${user.id}
  `);
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await requireUser();
  await prisma.$executeRaw(Prisma.sql`
    UPDATE "Notification"
    SET "readAt" = CURRENT_TIMESTAMP
    WHERE "userId" = ${user.id} AND "readAt" IS NULL
  `);
  revalidatePath("/notifications");
}
