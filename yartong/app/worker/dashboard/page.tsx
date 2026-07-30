import Link from "next/link";
import { UserRole } from "@prisma/client";

import { requireUser } from "@/lib/authz";
import { getProviderDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const OFFERED = [76, 83, 105, 101, 106, 104, 104];
const ACCEPTED = [52, 69, 81, 70, 80, 79, 87];
const WON = [38, 50, 61, 51, 61, 60, 60];
const MISSED = [15, 22, 21, 23, 25, 22, 32];

function points(values: number[]) {
  return values.map((value, index) => `${40 + index * 76},${150 - value}`).join(" ");
}

const metricCards = [
  { label: "Job win rate", value: "62%", trend: "↑ 8%", icon: "◎", tone: "emerald" },
  { label: "On-time completion", value: "92%", trend: "↑ 5%", icon: "◷", tone: "amber" },
  { label: "Repeat customer rate", value: "48%", trend: "↑ 12%", icon: "♙", tone: "violet" },
  { label: "Customer rating", value: "4.8/5", trend: "↑ 0.2", icon: "☆", tone: "amber" },
  { label: "Response time", value: "1.3 hrs", trend: "↓ 0.4 hrs", icon: "◌", tone: "violet" },
  { label: "Cancellation rate", value: "3%", trend: "↓ 1%", icon: "×", tone: "rose" },
] as const;

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
};

const desktopNav = [
  ["Dashboard", "/worker/dashboard", "▦"],
  ["Market Intelligence", "/worker/dashboard", "◎"],
  ["Business Performance", "/worker/dashboard", "▥"],
  ["Workforce & Skills", "/worker/dashboard", "♙"],
  ["Projects & Jobs", "/applications", "▣"],
  ["Customers & Reviews", "/worker/dashboard", "☆"],
  ["Finances", "/worker/dashboard", "◉"],
  ["Services & Trades", "/account", "⚒"],
  ["Opportunities", "/jobs", "◇"],
  ["Reports", "/worker/dashboard", "▤"],
  ["Settings", "/account", "⚙"],
] as const;

export default async function SkilledProviderDashboardPage() {
  const user = await requireUser();
  const dashboard = await getProviderDashboard(user.id, UserRole.SKILLED_PROVIDER);
  const profile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      image: true,
      displayName: true,
      verificationStatus: true,
      skilledProviderProfile: { select: { headline: true, businessName: true, skills: true, experienceYears: true } },
    },
  });

  const trade = profile.skilledProviderProfile?.skills?.[0] || "Skilled trade";
  const headline = profile.skilledProviderProfile?.headline || "Trusted local skilled professional";
  const completed = dashboard.metrics.completedEngagements;
  const accepted = dashboard.metrics.acceptedApplications;
  const offered = Math.max(accepted + dashboard.metrics.activeApplications + 4, 12);
  const won = Math.max(accepted, Math.round(offered * 0.62));

  return (
    <main className="min-h-screen bg-slate-50 pb-24 text-slate-950 lg:pb-0">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[265px_1fr]">
        <aside className="hidden min-h-screen border-r border-slate-200 bg-white lg:block">
          <div className="bg-[#0b2447] p-5 text-white">
            <div className="flex items-center gap-3">
              {profile.image ? <img src={profile.image} alt="" className="h-16 w-16 rounded-full border-4 border-white/20 object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl font-black">{profile.displayName.slice(0, 1)}</div>}
              <div className="min-w-0"><p className="truncate font-black">{profile.displayName}</p><p className="truncate text-xs text-blue-100">{trade}</p><p className="mt-1 text-xs text-amber-300">★★★★★ <span className="text-white">4.8</span></p></div>
            </div>
            <Link href={`/providers/${user.id}`} className="mt-5 block rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center text-sm font-bold transition hover:bg-white/15">View public profile ↗</Link>
          </div>
          <nav className="space-y-1 p-3">
            {desktopNav.map(([label, href, icon], index) => <Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${index === 0 ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}><span className="w-5 text-center">{icon}</span>{label}</Link>)}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-black tracking-[-0.05em] text-[#0b1b36] lg:hidden">YAR<span className="text-amber-400">TONG</span></Link>
              <div className="hidden min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:flex"><span className="text-slate-400">⌕</span><input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Search jobs, services, materials..." /></div>
              <div className="ml-auto flex items-center gap-3"><span className="hidden text-xs font-bold text-emerald-600 sm:block">● Online</span><span>◌</span><span>♧</span>{profile.image ? <img src={profile.image} alt="" className="h-9 w-9 rounded-full object-cover" /> : null}</div>
            </div>
          </div>

          <div className="space-y-4 p-3 sm:p-5 lg:p-7">
            <div className="rounded-2xl bg-[#0b2447] p-4 text-white lg:hidden">
              <div className="flex items-center gap-3">{profile.image ? <img src={profile.image} alt="" className="h-16 w-16 rounded-full border-4 border-white/15 object-cover" /> : null}<div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-xl font-black">{profile.displayName}</h1><span className="text-blue-300">●</span></div><p className="truncate text-sm text-blue-100">{headline}</p><p className="mt-1 text-sm text-amber-300">★★★★☆ <span className="text-white">4.8 (128 reviews)</span></p></div><span className="text-sm text-emerald-300">● Online</span></div>
              <Link href={`/providers/${user.id}`} className="mt-4 block rounded-xl border border-white/20 px-4 py-2.5 text-center text-sm font-bold">View profile ›</Link>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-black">Business Overview</h1><p className="mt-1 text-sm text-slate-500">Business health, workforce capability and market growth for your {trade.toLowerCase()} services.</p></div><div className="flex gap-2"><button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold">This month⌄</button><button className="hidden rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 sm:block">Export report</button></div></div>

            <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><h2 className="font-black">Business Performance Score</h2><Link href="/worker/dashboard" className="text-xs font-bold text-blue-700">View details →</Link></div>
                <div className="mt-5 flex items-center gap-5"><div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#2563eb_0_78%,#dbeafe_78%_100%)]"><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center"><div><strong className="block text-4xl">78</strong><span className="text-xs font-bold text-slate-500">/100 · Good</span></div></div></div><div><p className="text-sm text-slate-500">You perform better than</p><p className="text-4xl font-black">72%</p><p className="mt-1 text-sm text-slate-500">of skilled providers in {trade}</p></div></div>
              </section>

              <section className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-3 xl:grid-cols-6">
                {metricCards.map((item) => <div key={item.label} className="border-b border-r border-slate-100 p-4 last:border-r-0 xl:border-b-0"><span className={`grid h-9 w-9 place-items-center rounded-full text-lg font-black ${toneClasses[item.tone]}`}>{item.icon}</span><p className="mt-3 text-xs text-slate-500">{item.label}</p><p className="mt-1 text-xl font-black">{item.value}</p><p className={`mt-1 text-[11px] font-bold ${item.tone === "rose" ? "text-rose-600" : "text-emerald-600"}`}>{item.trend} vs last month</p></div>)}
              </section>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between"><div><h2 className="font-black">Job Funnel & Performance Trend</h2><p className="text-xs text-slate-500">Offered, accepted, won and missed opportunities.</p></div><Link href="/worker/dashboard" className="text-xs font-bold text-blue-700">Full analysis →</Link></div>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500"><span>● Jobs offered</span><span className="text-emerald-600">● Jobs accepted</span><span className="text-violet-600">● Jobs won</span><span className="text-rose-600">■ Jobs missed</span></div>
                <div className="mt-3 overflow-x-auto"><svg viewBox="0 0 540 190" className="h-56 min-w-[520px] w-full"><g stroke="#e2e8f0" strokeWidth="1">{[30,70,110,150].map(y => <line key={y} x1="36" y1={y} x2="510" y2={y} />)}</g>{MISSED.map((v,i)=><rect key={i} x={27+i*76} y={150-v} width="20" height={v} rx="4" fill="#fb7185" opacity=".8" />)}<polyline fill="none" stroke="#2563eb" strokeWidth="3" points={points(OFFERED)} /><polyline fill="none" stroke="#16a34a" strokeWidth="3" points={points(ACCEPTED)} /><polyline fill="none" stroke="#7c3aed" strokeWidth="3" points={points(WON)} />{MONTHS.map((m,i)=><text key={m} x={40+i*76} y="178" textAnchor="middle" fontSize="11" fill="#64748b">{m}</text>)}</svg></div>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-5">{[["Jobs offered",offered],["Jobs won",won],["Win rate","62%"],["Jobs missed",Math.max(offered-won,0)],["On-time","92%"]].map(([label,value])=><div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 font-black">{value}</p></div>)}</div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black">Strengths & Weaknesses</h2><Link href="/worker/dashboard" className="text-xs font-bold text-blue-700">View all →</Link></div><div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><div><p className="text-sm font-black text-emerald-700">Strengths</p><ul className="mt-3 space-y-3 text-sm text-slate-600"><li>● {trade} jobs have an 82% success rate.</li><li>● Projects finish 1.4 days faster than similar providers.</li><li>● Repeat customers increased by 18%.</li><li>● Advanced-skilled workers produce the highest ratings.</li></ul></div><div><p className="text-sm font-black text-rose-600">Weaknesses</p><ul className="mt-3 space-y-3 text-sm text-slate-600"><li>× Only 34% of low-margin enquiries become confirmed jobs.</li><li>× Response time is slower during evenings.</li><li>× Two safety certifications need renewal.</li><li>× Some projects exceed estimates by 12%.</li></ul></div></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-amber-700">Top recommendation</p><p className="mt-1 text-sm text-amber-950">Reply within one hour during evenings to improve your win rate by an estimated 15–20%.</p></div></section>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black">Workforce & Skills Overview</h2><Link href="/worker/dashboard" className="text-xs font-bold text-blue-700">View all</Link></div><div className="mt-5 grid gap-5 sm:grid-cols-3"><div className="space-y-3 text-sm"><p className="flex justify-between"><span>Total workers</span><b>18</b></p><p className="flex justify-between"><span>Available today</span><b>12</b></p><p className="flex justify-between"><span>On projects</span><b>6</b></p><p className="flex justify-between"><span>On leave</span><b>0</b></p></div><div className="flex items-center gap-4"><div className="grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(#7c3aed_0_39%,#2563eb_39%_83%,#16a34a_83%_100%)]"><div className="grid h-14 w-14 place-items-center rounded-full bg-white text-center text-sm font-black">18<br/><span className="text-[9px] text-slate-500">workers</span></div></div><div className="space-y-2 text-xs"><p>● Advanced 7</p><p className="text-blue-700">● Intermediate 8</p><p className="text-emerald-700">● Apprentice 3</p></div></div><div className="space-y-3 text-sm"><p className="flex justify-between"><span>Valid certificates</span><b className="text-emerald-600">15</b></p><p className="flex justify-between"><span>Expiring soon</span><b className="text-amber-600">2</b></p><p className="flex justify-between"><span>Expired</span><b className="text-rose-600">1</b></p></div></div></section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black">Trade Performance ({trade})</h2><Link href="/worker/dashboard" className="text-xs font-bold text-blue-700">View trades →</Link></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs text-slate-400"><tr><th className="py-2">Service category</th><th>Jobs won</th><th>Win rate</th><th>Avg. days</th><th>Rating</th></tr></thead><tbody className="divide-y divide-slate-100">{[[`${trade} installation`,32,"68%","2.1","4.9"],[`${trade} repair`,25,"82%","1.6","4.8"],["Maintenance",14,"58%","2.8","4.7"],["Emergency service",6,"50%","2.3","4.6"]].map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={index} className={`py-3 ${index===0?"font-semibold":""}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-black">Market Insights & Opportunities</h2><Link href="/jobs" className="text-xs font-bold text-blue-700">View opportunities →</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["High demand",`${trade} demand is rising in your area this month.`],["Top opportunity","Optimising response time could unlock ₹28,000 more monthly."],["Competitor insight","Your win rate is 12% higher than nearby providers."],["Revenue potential","Commercial projects could increase revenue by 35%."]].map(([title,text])=><div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black text-blue-700">{title}</p><p className="mt-2 text-sm text-slate-600">{text}</p><button className="mt-3 text-xs font-bold text-blue-700">Learn more →</button></div>)}</div></section>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">{[["Dashboard","▦","/worker/dashboard"],["Market","▥","/worker/dashboard"],["Workforce","♙","/worker/dashboard"],["Projects","▣","/applications"],["More","•••","/account"]].map(([label,icon,href],index)=><Link key={label} href={href} className={`flex flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-bold ${index===0?"text-blue-700":"text-slate-500"}`}><span className="text-lg">{icon}</span>{label}</Link>)}</nav>
    </main>
  );
}
