import { AccountStatus, UserRole } from "@prisma/client";

import { PublicShell } from "@/components/layout/public-shell";
import { prisma } from "@/lib/prisma";

import { updateUserAccountStatusAction } from "./actions";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { primaryRole: { not: UserRole.ADMIN } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      displayName: true,
      email: true,
      primaryRole: true,
      accountStatus: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl px-6 py-10 text-white sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200/75">Admin safety operations</p>
        <h1 className="mt-3 text-4xl font-black">User administration</h1>
        <p className="mt-3 max-w-3xl leading-7 text-white/60">
          Suspend unsafe accounts, restore access after review, or deactivate accounts. Administrator accounts and role changes are protected from this surface.
        </p>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-5 py-4">Account</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Trust</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th><th className="px-5 py-4">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="align-top">
                    <td className="px-5 py-5"><p className="font-bold">{user.displayName || "Unnamed account"}</p><p className="mt-1 text-xs text-white/45">{user.email || "No email"}</p></td>
                    <td className="px-5 py-5">{user.primaryRole.replaceAll("_", " ")}</td>
                    <td className="px-5 py-5">{user.verificationStatus.replaceAll("_", " ")}</td>
                    <td className="px-5 py-5 font-bold">{user.accountStatus}</td>
                    <td className="px-5 py-5 text-white/55">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-5"><div className="flex flex-wrap gap-2">
                      {user.accountStatus !== AccountStatus.ACTIVE ? <form action={updateUserAccountStatusAction.bind(null, user.id, AccountStatus.ACTIVE)}><button className="rounded-full border border-emerald-200/25 bg-emerald-200/10 px-4 py-2 font-bold text-emerald-50">Restore</button></form> : null}
                      {user.accountStatus !== AccountStatus.SUSPENDED ? <form action={updateUserAccountStatusAction.bind(null, user.id, AccountStatus.SUSPENDED)}><button className="rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 font-bold text-amber-50">Suspend</button></form> : null}
                      {user.accountStatus !== AccountStatus.DEACTIVATED ? <form action={updateUserAccountStatusAction.bind(null, user.id, AccountStatus.DEACTIVATED)}><button className="rounded-full border border-rose-200/25 bg-rose-200/10 px-4 py-2 font-bold text-rose-50">Deactivate</button></form> : null}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!users.length ? <p className="p-8 text-white/50">No non-admin accounts found.</p> : null}
        </section>
      </main>
    </PublicShell>
  );
}
