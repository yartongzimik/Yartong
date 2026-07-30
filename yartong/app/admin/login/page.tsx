import { redirect } from "next/navigation";

import { isQaTestAccessEnabled } from "@/auth";
import { ROUTES } from "@/lib/constants";

import { signInAsQaUser } from "../../login/actions";

export default function AdminLoginPage() {
  if (!isQaTestAccessEnabled) redirect(`/login?callbackUrl=${encodeURIComponent(ROUTES.adminDashboard)}`);

  return (
    <main className="min-h-screen bg-[#07050D] px-5 py-12 text-white sm:px-8">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[#12091d] p-7 shadow-2xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-200">Restricted QA access</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Yartong administration</h1>
        <p className="mt-4 text-sm leading-6 text-white/55">This route is separate from public Join and Login. On QA preview deployments it opens the seeded administrator account for testing moderation and administration tools.</p>
        <form action={async () => { "use server"; await signInAsQaUser("admin.demo@yartong.local", ROUTES.adminDashboard); }} className="mt-7">
          <button className="w-full rounded-full bg-white px-6 py-3 font-black text-[#160620] transition hover:bg-fuchsia-100">Enter QA admin dashboard</button>
        </form>
      </section>
    </main>
  );
}
