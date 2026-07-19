"use server";

import {
  UserRole,
  VerificationRequestStatus,
  VerificationRequestType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const PROVIDER_ROLES = new Set<UserRole>([
  UserRole.SKILLED_PROVIDER,
  UserRole.LABOURER,
  UserRole.CONTRACTOR,
  UserRole.MATERIAL_SUPPLIER,
]);

const BUSINESS_ROLES = new Set<UserRole>([
  UserRole.SKILLED_PROVIDER,
  UserRole.CONTRACTOR,
  UserRole.MATERIAL_SUPPLIER,
]);

function canRequest(role: UserRole, type: VerificationRequestType) {
  if (type === VerificationRequestType.IDENTITY) return role !== UserRole.ONBOARDING_PENDING;
  if (type === VerificationRequestType.BUSINESS) return BUSINESS_ROLES.has(role);
  return PROVIDER_ROLES.has(role);
}

export async function submitVerificationRequestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const rawType = String(formData.get("type") ?? "");
  const applicantNote = String(formData.get("applicantNote") ?? "").trim();

  if (!Object.values(VerificationRequestType).includes(rawType as VerificationRequestType)) {
    throw new Error("Choose a valid verification type.");
  }
  const type = rawType as VerificationRequestType;
  if (!canRequest(user.primaryRole, type)) {
    throw new Error("This verification type is not available for your account role.");
  }
  if (applicantNote.length > 2000) {
    throw new Error("Verification note is too long.");
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.verificationRequest.findFirst({
      where: {
        userId: user.id,
        type,
        status: {
          in: [
            VerificationRequestStatus.SUBMITTED,
            VerificationRequestStatus.UNDER_REVIEW,
          ],
        },
      },
      select: { id: true },
    });

    if (existing) throw new Error("You already have an active request of this type.");

    await tx.verificationRequest.create({
      data: {
        userId: user.id,
        type,
        applicantNote: applicantNote || null,
      },
    });
  }, { isolationLevel: "Serializable" });

  revalidatePath("/verification");
  revalidatePath("/admin/verifications");
}

export async function cancelVerificationRequestAction(requestId: string): Promise<void> {
  const user = await requireUser();
  const result = await prisma.verificationRequest.updateMany({
    where: {
      id: requestId,
      userId: user.id,
      status: VerificationRequestStatus.SUBMITTED,
    },
    data: { status: VerificationRequestStatus.CANCELLED },
  });

  if (result.count !== 1) {
    throw new Error("This verification request can no longer be cancelled.");
  }

  revalidatePath("/verification");
  revalidatePath("/admin/verifications");
}
