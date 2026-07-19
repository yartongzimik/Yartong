"use client";

import { useEffect } from "react";

import { markConversationReadAction } from "@/app/messages/actions";

export function MessageReadMarker({ conversationId }: { conversationId: string }) {
  useEffect(() => {
    void markConversationReadAction(conversationId);
  }, [conversationId]);

  return null;
}
