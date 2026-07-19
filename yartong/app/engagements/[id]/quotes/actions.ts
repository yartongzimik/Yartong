"use server";

import { EngagementStatus, QuoteStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

function positiveWholeNumber(value: FormDataEntryValue | null, label: string) {
  const parsed = Number(String(value ?? "").trim());
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive whole number.`);
  }
  return parsed;
}

export async function submitEngagementQuoteAction(
  engagementId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const amountRupees = positiveWholeNumber(formData.get("amount"), "Amount");
  const amount = amountRupees * 100;
  const timelineRaw = String(formData.get("timelineDays") ?? "").trim();
  const timelineDays = timelineRaw
    ? positiveWholeNumber(formData.get("timelineDays"), "Timeline")
    : null;
  const scope = String(formData.get("scope") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!scope || scope.length > 5000) throw new Error("Quote scope must be between 1 and 5000 characters.");
  if (note.length > 2000) throw new Error("Quote note is too long.");

  await prisma.$transaction(async (tx) => {
    const engagement = await tx.engagement.findFirst({
      where: {
        id: engagementId,
        providerId: user.id,
        status: EngagementStatus.PENDING,
      },
      select: { id: true, currency: true },
    });
    if (!engagement) throw new Error("Only the hired provider can quote before engagement confirmation.");

    await tx.engagementQuote.updateMany({
      where: { engagementId, status: QuoteStatus.SUBMITTED },
      data: { status: QuoteStatus.SUPERSEDED, respondedAt: new Date() },
    });

    await tx.engagementQuote.create({
      data: {
        engagementId,
        createdById: user.id,
        amount,
        currency: engagement.currency,
        scope,
        timelineDays,
        note: note || null,
      },
    });
  }, { isolationLevel: "Serializable" });

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/quotes`);
}

export async function respondToEngagementQuoteAction(
  engagementId: string,
  quoteId: string,
  decision: "accept" | "reject",
): Promise<void> {
  const user = await requireUser();

  await prisma.$transaction(async (tx) => {
    const quote = await tx.engagementQuote.findFirst({
      where: {
        id: quoteId,
        engagementId,
        status: QuoteStatus.SUBMITTED,
        engagement: {
          customerId: user.id,
          status: EngagementStatus.PENDING,
        },
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        scope: true,
        timelineDays: true,
      },
    });
    if (!quote) throw new Error("This quote is no longer available for response.");

    const nextStatus = decision === "accept" ? QuoteStatus.ACCEPTED : QuoteStatus.REJECTED;
    const updated = await tx.engagementQuote.updateMany({
      where: { id: quote.id, status: QuoteStatus.SUBMITTED },
      data: { status: nextStatus, respondedAt: new Date() },
    });
    if (updated.count !== 1) throw new Error("This quote changed concurrently.");

    if (decision === "accept") {
      const engagementUpdated = await tx.engagement.updateMany({
        where: {
          id: engagementId,
          customerId: user.id,
          status: EngagementStatus.PENDING,
        },
        data: {
          agreedPrice: quote.amount,
          currency: quote.currency,
          scope: quote.scope,
          proposedTimelineDays: quote.timelineDays,
        },
      });
      if (engagementUpdated.count !== 1) throw new Error("Engagement terms could not be updated.");

      await tx.engagementQuote.updateMany({
        where: {
          engagementId,
          id: { not: quote.id },
          status: QuoteStatus.SUBMITTED,
        },
        data: { status: QuoteStatus.SUPERSEDED, respondedAt: new Date() },
      });
    }
  });

  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath(`/engagements/${engagementId}/quotes`);
}

export async function withdrawEngagementQuoteAction(
  engagementId: string,
  quoteId: string,
): Promise<void> {
  const user = await requireUser();
  const result = await prisma.engagementQuote.updateMany({
    where: {
      id: quoteId,
      engagementId,
      createdById: user.id,
      status: QuoteStatus.SUBMITTED,
      engagement: { providerId: user.id, status: EngagementStatus.PENDING },
    },
    data: { status: QuoteStatus.WITHDRAWN, respondedAt: new Date() },
  });
  if (result.count !== 1) throw new Error("This quote can no longer be withdrawn.");

  revalidatePath(`/engagements/${engagementId}/quotes`);
}
