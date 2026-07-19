import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { PLATFORM_LIMITS } from "@/lib/constants";
import {
  getUserConversation,
  markConversationRead,
} from "@/lib/marketplace/messages";

import { sendMessageAction } from "./actions";

type Props = { params: Promise<{ id: string }> };

export default async function ConversationPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const conversation = await getUserConversation(user.id, id);

  if (!conversation) notFound();

  await markConversationRead(user.id, id);

  const otherParticipant =
    conversation.customerId === user.id
      ? conversation.provider
      : conversation.customer;

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Private conversation
        </p>
        <h1 className="mt-3 text-3xl font-black">
          {otherParticipant.displayName || "Yartong member"}
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Work engagement: {conversation.engagement.job.title}
        </p>

        <section
          className="mt-8 space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          aria-label="Conversation messages"
        >
          {conversation.messages.length === 0 ? (
            <p className="text-white/55">No messages yet. Start the conversation below.</p>
          ) : null}

          {conversation.messages.map((message) => {
            const mine = message.senderId === user.id;
            return (
              <article
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  mine
                    ? "ml-auto bg-fuchsia-200 text-[#14091f]"
                    : "bg-white/10 text-white"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.body}
                </p>
                <p className={`mt-2 text-[11px] ${mine ? "text-[#14091f]/60" : "text-white/40"}`}>
                  {message.createdAt.toLocaleString("en-IN")}
                </p>
              </article>
            );
          })}
        </section>

        <form
          action={sendMessageAction.bind(null, conversation.id)}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5"
        >
          <label htmlFor="body" className="text-sm font-black">
            Send a message
          </label>
          <textarea
            id="body"
            name="body"
            required
            maxLength={PLATFORM_LIMITS.maximumMessageLength}
            rows={4}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-fuchsia-300"
            placeholder="Write a private message about this work engagement…"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              Maximum {PLATFORM_LIMITS.maximumMessageLength} characters.
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
