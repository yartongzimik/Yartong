import Link from "next/link";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/authz";

export default async function AccountBlockedPage() {
  const user = await getCurrentUser();
  return <main className="min-h-screen bg-[#07050D] px-5 py-12 text-white"><section className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-[#12091d] p-8 shadow-2xl shadow-fuchsia-950/30"><p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-200">Account access</p><h1 className="mt-3 text-4xl font-black">This account cannot access protected Yartong areas.</h1><p className="mt-4 text-white/70">Your account status is currently {user?.accountStatus?.toLowerCase() ?? "unavailable"}. For safety, dashboards and onboarding are unavailable. This message does not include internal review details.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="rounded-full border border-white/15 px-5 py-3 font-bold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Back to Yartong</Link><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="rounded-full bg-white px-5 py-3 font-bold text-[#160620] hover:bg-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-100">Sign out</button></form></div></section></main>;
}
