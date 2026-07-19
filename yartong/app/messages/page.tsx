import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { getUserConversations } from "@/lib/marketplace/messages";

export default async function MessagesPage() {
  const user = await requireUser();
  const conversations = await getUserConversations(user.id);

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/75">
          Private messaging
        </p>
        <h1 className="mt-3 text-4xl font-black">Messages</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Conversations are available only between the customer and provider linked to a hired work engagement.
        </p>

        <section className="mt-8 space-y-3" aria-label="Conversations">
          {conversations.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-white/60">
              You do not have any conversations yet. A private conversation is created when a customer hires a provider.
            </div>
          ) : null}

          {conversations.map((conversation) => {
            const otherParticipant =
              conversation.customerId === user.id
                ? conversation.provider
                : conversation.customer;
            const latest = conversation.messages[0];

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{otherParticipant.displayName || "Yartong member"}</p>
                    <p className="mt-1 text-sm text-white/55">{conversation.engagement.job.title}</p>
                  </div>
                  {conversation._count.messages > 0 ? (
                    <span className="rounded-full bg-fuchsia-200 px-3 py-1 text-xs font-black text-[#14091f]">
                      {conversation._count.messages} unread
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-white/70">
                  {latest ? latest.body : "No messages yet. Start the conversation."}
                </p>
                <p className="mt-3 text-xs text-white/40">
                  {conversation.lastMessageAt.toLocaleString("en-IN")}
                </p>
              </Link>
            );
          })}
        </section>
      </main>
    </PublicShell>
  );
}
