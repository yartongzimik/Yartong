import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { MessageReadMarker } from "@/components/marketplace/message-read-marker";
import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import { getUserConversation } from "@/lib/marketplace/messages";

import { sendMessageAction } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function ConversationPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const conversation = await getUserConversation(user.id, id);

  if (!conversation) notFound();

  const counterpart =
    conversation.customerId === user.id
      ? conversation.provider
      : conversation.customer;

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <MessageReadMarker conversationId={conversation.id} />
        <Link href="/messages" className="text-sm font-bold text-fuchsia-200">
          ← Back to messages
        </Link>
        <h1 className="mt-4 text-4xl font-black">
          {counterpart.displayName || "Yartong member"}
        </h1>
        <p className="mt-2 text-white/55">{conversation.engagement.job.title}</p>

        <section className="mt-8 space-y-3" aria-label="Conversation messages">
          {conversation.messages.length === 0 ? (
            <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-white/55">
              No messages yet. Start the conversation below.
            </p>
          ) : null}
          {conversation.messages.map((message) => {
            const mine = message.senderId === user.id;
            return (
              <article
                key={message.id}
                className={`max-w-[85%] rounded-3xl border p-4 ${
                  mine
                    ? "ml-auto border-fuchsia-200/20 bg-fuchsia-200/10"
                    : "border-white/10 bg-white/[0.06]"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.body}
                </p>
                <p className="mt-2 text-xs text-white/45">
                  {message.createdAt.toLocaleString("en-IN")}
                  {mine && message.readAt ? " · Read" : ""}
                </p>
              </article>
            );
          })}
        </section>

        <form
          action={sendMessageAction.bind(null, conversation.id)}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-5"
        >
          <label htmlFor="body" className="text-sm font-black">
            Message
          </label>
          <textarea
            id="body"
            name="body"
            required
            maxLength={PLATFORM_LIMITS.maximumMessageLength}
            rows={4}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none focus:border-fuchsia-200/40"
            placeholder="Write a message about this work engagement…"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-white/45">
              Up to {PLATFORM_LIMITS.maximumMessageLength} characters.
            </p>
            <button className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]">
              Send message
            </button>
          </div>
        </form>
      </main>
    </PublicShell>
  );
}
