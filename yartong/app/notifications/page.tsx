import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { requireUser } from "@/lib/authz";
import { countUnreadNotifications, listUserNotifications } from "@/lib/notifications";

import { markAllNotificationsReadAction, markNotificationReadAction } from "./actions";

export default async function NotificationsPage() {
  const user = await requireUser();
  const [notifications, unreadCount] = await Promise.all([
    listUserNotifications(user.id),
    countUnreadNotifications(user.id),
  ]);

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200/70">Activity centre</p>
            <h1 className="mt-3 text-4xl font-black">Notifications</h1>
            <p className="mt-3 text-white/55">{unreadCount} unread update{unreadCount === 1 ? "" : "s"}</p>
          </div>
          {unreadCount ? (
            <form action={markAllNotificationsReadAction}>
              <button className="rounded-full border border-white/15 px-5 py-3 font-black">Mark all read</button>
            </form>
          ) : null}
        </div>

        <section className="mt-8 space-y-3">
          {notifications.length ? notifications.map((notification) => (
            <article key={notification.id} className={`rounded-3xl border p-5 ${notification.readAt ? "border-white/10 bg-white/[0.025]" : "border-fuchsia-200/25 bg-fuchsia-200/[0.07]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/45">{notification.type}</span>
                    {!notification.readAt ? <span className="rounded-full bg-fuchsia-200 px-2 py-1 text-[10px] font-black text-fuchsia-950">NEW</span> : null}
                  </div>
                  <h2 className="mt-3 text-lg font-black">{notification.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">{notification.body}</p>
                  <p className="mt-3 text-xs text-white/35">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(notification.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {notification.href ? <Link href={notification.href} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Open</Link> : null}
                  {!notification.readAt ? (
                    <form action={markNotificationReadAction.bind(null, notification.id)}>
                      <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Mark read</button>
                    </form>
                  ) : null}
                </div>
              </div>
            </article>
          )) : (
            <p className="rounded-3xl border border-white/10 p-8 text-white/50">No notifications yet. Important marketplace updates will appear here.</p>
          )}
        </section>
      </main>
    </PublicShell>
  );
}
