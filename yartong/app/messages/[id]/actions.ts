"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

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

  await prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ customerId: user.id }, { providerId: user.id }],
      },
      select: { id: true },
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
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
}
