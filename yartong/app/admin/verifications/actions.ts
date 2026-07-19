"use server";

import {
  VerificationRequestStatus,
  VerificationRequestType,
  VerificationStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const VERIFICATION_RANK: Record<VerificationStatus, number> = {
  UNVERIFIED: 0,
  PHONE_VERIFIED: 1,
  IDENTITY_VERIFIED: 2,
  BUSINESS_VERIFIED: 3,
  YARTONG_VERIFIED: 4,
};

function approvedUserStatus(type: VerificationRequestType): VerificationStatus {
  if (type === VerificationRequestType.IDENTITY) return VerificationStatus.IDENTITY_VERIFIED;
  if (type === VerificationRequestType.BUSINESS) return VerificationStatus.BUSINESS_VERIFIED;
  return VerificationStatus.YARTONG_VERIFIED;
}

export async function reviewVerificationRequestAction(
  requestId: string,
  nextStatus: VerificationRequestStatus,
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");
  if (
    nextStatus !== VerificationRequestStatus.UNDER_REVIEW &&
    nextStatus !== VerificationRequestStatus.APPROVED &&
    nextStatus !== VerificationRequestStatus.REJECTED
  ) {
    throw new Error("Unsupported verification review transition.");
  }

  const reviewerNote = String(formData.get("reviewerNote") ?? "").trim();
  if (reviewerNote.length > 2000) throw new Error("Reviewer note is too long.");

  await prisma.$transaction(async (tx) => {
    const request = await tx.verificationRequest.findFirst({
      where: {
        id: requestId,
        status: {
          in: [
            VerificationRequestStatus.SUBMITTED,
            VerificationRequestStatus.UNDER_REVIEW,
          ],
        },
      },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        applicant: { select: { verificationStatus: true } },
      },
    });
    if (!request) throw new Error("This verification request is no longer reviewable.");

    if (
      request.status === VerificationRequestStatus.SUBMITTED &&
      nextStatus !== VerificationRequestStatus.UNDER_REVIEW &&
      nextStatus !== VerificationRequestStatus.APPROVED &&
      nextStatus !== VerificationRequestStatus.REJECTED
    ) {
      throw new Error("Invalid verification transition.");
    }

    const updated = await tx.verificationRequest.updateMany({
      where: { id: request.id, status: request.status },
      data: {
        status: nextStatus,
        reviewerId: admin.id,
        reviewerNote: reviewerNote || null,
        reviewedAt:
          nextStatus === VerificationRequestStatus.APPROVED ||
          nextStatus === VerificationRequestStatus.REJECTED
            ? new Date()
            : null,
      },
    });
    if (updated.count !== 1) throw new Error("Verification request changed concurrently.");

    if (nextStatus === VerificationRequestStatus.APPROVED) {
      const target = approvedUserStatus(request.type);
      if (VERIFICATION_RANK[target] > VERIFICATION_RANK[request.applicant.verificationStatus]) {
        await tx.user.update({
          where: { id: request.userId },
          data: { verificationStatus: target },
        });
      }
    }
  });

  revalidatePath("/admin/verifications");
  revalidatePath("/verification");
  revalidatePath("/workers");
  revalidatePath("/trades");
}
