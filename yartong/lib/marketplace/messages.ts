import { PAGINATION } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { OR: [{ customerId: userId }, { providerId: userId }] },
    orderBy: { lastMessageAt: "desc" },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      lastMessageAt: true,
      customer: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true } },
      engagement: {
        select: {
          id: true,
          status: true,
          job: { select: { id: true, title: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, senderId: true, body: true, readAt: true, createdAt: true },
      },
      _count: {
        select: {
          messages: {
            where: { senderId: { not: userId }, readAt: null },
          },
        },
      },
    },
  });
}

export async function getUserConversation(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      customer: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true } },
      engagement: {
        select: {
          id: true,
          status: true,
          job: { select: { id: true, title: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: PAGINATION.messagesPerPage,
        select: {
          id: true,
          senderId: true,
          body: true,
          readAt: true,
          createdAt: true,
          sender: { select: { displayName: true } },
        },
      },
    },
  });

  if (!conversation) return null;
  return {
    ...conversation,
    messages: [...conversation.messages].reverse(),
  };
}

export async function markConversationRead(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: { id: true },
  });

  if (!conversation) return false;

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return true;
}
