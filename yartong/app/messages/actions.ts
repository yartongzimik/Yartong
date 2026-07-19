"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function startConversationAction(engagementId: string): Promise<void> {
  const user = await requireUser();

  const engagement = await prisma.engagement.findFirst({
    where: {
      id: engagementId,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: { id: true, customerId: true, providerId: true },
  });

  if (!engagement) throw new Error("You cannot message participants in this engagement.");

  const conversation = await prisma.conversation.upsert({
    where: { engagementId: engagement.id },
    update: {},
    create: {
      engagementId: engagement.id,
      customerId: engagement.customerId,
      providerId: engagement.providerId,
    },
    select: { id: true },
  });

  revalidatePath("/messages");
  redirect(`/messages/${conversation.id}`);
}

export async function sendMessageAction(
  conversationId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();

  if (!body || body.length > PLATFORM_LIMITS.maximumMessageLength) {
    throw new Error(
      `Message must be between 1 and ${PLATFORM_LIMITS.maximumMessageLength} characters.`,
    );
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ customerId: user.id }, { providerId: user.id }],
      },
      select: { id: true },
    });

    if (!conversation) throw new Error("You cannot send messages in this conversation.");

    await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        body,
      },
    });

    await tx.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: now },
    });
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
}

export async function markConversationReadAction(conversationId: string): Promise<void> {
  const user = await requireUser();

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ customerId: user.id }, { providerId: user.id }],
    },
    select: { id: true },
  });

  if (!conversation) return;

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/messages");
}
