"use server";

import { AccountStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = new Set<AccountStatus>([
  AccountStatus.ACTIVE,
  AccountStatus.SUSPENDED,
  AccountStatus.DEACTIVATED,
]);

export async function updateUserAccountStatusAction(
  userId: string,
  nextStatus: AccountStatus,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!ALLOWED_STATUSES.has(nextStatus)) {
    throw new Error("Unsupported account status transition.");
  }
  if (userId === admin.id) {
    throw new Error("Administrators cannot change their own account status here.");
  }

  const result = await prisma.user.updateMany({
    where: {
      id: userId,
      primaryRole: { not: UserRole.ADMIN },
    },
    data: {
      accountStatus: nextStatus,
      lastActiveAt: nextStatus === AccountStatus.ACTIVE ? new Date() : undefined,
    },
  });

  if (result.count !== 1) {
    throw new Error("Account was not found or is protected from this operation.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}
