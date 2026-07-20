"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { createNotificationWithTx } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { enforceMutationRateLimit } from "@/lib/rate-limit";

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

  await enforceMutationRateLimit({
    actorId: user.id,
    action: "send-message",
    limit: 30,
    windowSeconds: 60,
  });

  await prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ customerId: user.id }, { providerId: user.id }],
      },
      select: { id: true, customerId: true, providerId: true },
    });

    if (!conversation) throw new Error("Conversation not found.");

    const now = new Date();
    await tx.message.create({
      data: {
        conversationId,
        senderId: user.id,
        body,
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: now },
    });

    const recipientId =
      conversation.customerId === user.id
        ? conversation.providerId
        : conversation.customerId;

    await createNotificationWithTx(tx, {
      userId: recipientId,
      type: "MESSAGE",
      title: "New message",
      body: body.length > 140 ? `${body.slice(0, 137)}…` : body,
      href: `/messages/${conversationId}`,
    });
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/notifications");
}
