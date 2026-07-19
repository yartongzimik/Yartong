import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const conversationListSelect = {
  id: true,
  engagementId: true,
  customerId: true,
  providerId: true,
  lastMessageAt: true,
  engagement: {
    select: {
      id: true,
      status: true,
      job: { select: { id: true, title: true } },
    },
  },
  customer: { select: { id: true, displayName: true } },
  provider: { select: { id: true, displayName: true } },
  messages: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    select: { body: true, senderId: true, createdAt: true },
  },
} satisfies Prisma.ConversationSelect;

export async function getUserConversations(userId: string) {
  const rows = await prisma.conversation.findMany({
    where: { OR: [{ customerId: userId }, { providerId: userId }] },
    select: conversationListSelect,
    orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
  });

  const unread = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversation: { OR: [{ customerId: userId }, { providerId: userId }] },
      senderId: { not: userId },
      readAt: null,
    },
    _count: { _all: true },
  });

  const unreadByConversation = new Map(
    unread.map((row) => [row.conversationId, row._count._all]),
  );

  return rows.map((row) => ({
    ...row,
    unreadCount: unreadByConversation.get(row.id) ?? 0,
  }));
}

export async function getUserConversation(userId: string, conversationId: string) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: {
      id: true,
      engagementId: true,
      customerId: true,
      providerId: true,
      engagement: {
        select: {
          id: true,
          status: true,
          job: { select: { id: true, title: true } },
        },
      },
      customer: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true } },
      messages: {
        orderBy: [{ createdAt: "asc" }],
        take: 200,
        select: {
          id: true,
          senderId: true,
          body: true,
          readAt: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getMessageableEngagements(userId: string) {
  return prisma.engagement.findMany({
    where: {
      OR: [{ customerId: userId }, { providerId: userId }],
      conversation: null,
    },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      status: true,
      job: { select: { id: true, title: true } },
      customer: { select: { id: true, displayName: true } },
      provider: { select: { id: true, displayName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
