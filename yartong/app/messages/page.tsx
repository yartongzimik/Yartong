import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import {
  getMessageableEngagements,
  getUserConversations,
} from "@/lib/marketplace/messages";

import { startConversationAction } from "./actions";

export default async function MessagesPage() {
  const user = await requireUser();
  const [conversations, availableEngagements] = await Promise.all([
    getUserConversations(user.id),
    getMessageableEngagements(user.id),
  ]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <h1 className="text-4xl font-black">Messages</h1>
        <p className="mt-3 text-white/60">
          Private conversations are available only between the customer and hired provider on a work engagement.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black">Conversations</h2>
          {conversations.length === 0 ? (
            <p className="text-white/55">No conversations yet.</p>
          ) : null}
          {conversations.map((conversation) => {
            const counterpart =
              conversation.customerId === user.id
                ? conversation.provider
                : conversation.customer;
            const latest = conversation.messages[0];

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition hover:bg-white/[0.09]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{counterpart.displayName || "Yartong member"}</p>
                    <p className="mt-1 text-sm text-white/55">{conversation.engagement.job.title}</p>
                  </div>
                  {conversation.unreadCount > 0 ? (
                    <span className="rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-[#14091f]">
                      {conversation.unreadCount} unread
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-white/65">
                  {latest?.body ?? "Conversation created. Send the first message."}
                </p>
              </Link>
            );
          })}
        </section>

        {availableEngagements.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-black">Start a conversation</h2>
            <div className="mt-4 space-y-3">
              {availableEngagements.map((engagement) => {
                const counterpart =
                  engagement.customerId === user.id
                    ? engagement.provider
                    : engagement.customer;
                return (
                  <article
                    key={engagement.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div>
                      <p className="font-black">{engagement.job.title}</p>
                      <p className="mt-1 text-sm text-white/55">
                        Message {counterpart.displayName || "the other participant"}
                      </p>
                    </div>
                    <form action={startConversationAction.bind(null, engagement.id)}>
                      <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#14091f]">
                        Start conversation
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>
    </PublicShell>
  );
}
