import { PaymentStatus } from "@prisma/client";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

import { CustomerWorkspaceShell } from "../customer-workspace-shell";

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100); }

export default async function CustomerPaymentsPage() {
  const user = await requireUser();
  const payments = await prisma.paymentOrder.findMany({ where: { customerId: user.id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, amount: true, status: true, createdAt: true, providerName: true } });
  const succeeded = payments.filter((payment) => payment.status === PaymentStatus.SUCCEEDED);
  const total = succeeded.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => [PaymentStatus.CREATED, PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.REQUIRES_ACTION].includes(payment.status)).reduce((sum, payment) => sum + payment.amount, 0);
  const refunded = payments.filter((payment) => payment.status === PaymentStatus.REFUNDED).reduce((sum, payment) => sum + payment.amount, 0);
  return <CustomerWorkspaceShell active="Payments" title="Payments" subtitle="View transaction history and payment status. Payment execution remains disabled during testing.">
    <section className="grid grid-cols-2 gap-2 md:grid-cols-4">{[["Total spent", money(total)], ["Transactions", payments.length], ["Pending", money(pending)], ["Refunded", money(refunded)]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/80 bg-white/94 p-3 shadow-sm"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>)}</section>
    <section className="mt-3 overflow-hidden rounded-2xl border border-white/80 bg-white/94 shadow-sm"><div className="border-b border-slate-200 p-3"><h2 className="text-sm font-black">Transaction history</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase text-slate-400"><tr><th className="px-4 py-3">Transaction</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody className="divide-y divide-slate-100">{payments.map((payment) => <tr key={payment.id}><td className="px-4 py-3 font-mono text-[10px]">{payment.id.slice(0, 12)}</td><td>{payment.providerName || "Yartong"}</td><td className="font-black">{money(payment.amount)}</td><td><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">{payment.status.replaceAll("_", " ")}</span></td><td>{payment.createdAt.toLocaleDateString("en-IN")}</td></tr>)}{!payments.length ? <tr><td colSpan={5} className="p-5 text-center text-slate-500">No payment transactions yet.</td></tr> : null}</tbody></table></div></section>
    <section className="mt-3 grid gap-2 sm:grid-cols-3"><div className="rounded-xl border border-white/80 bg-white/94 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">UPI</p><p className="mt-1 text-xs font-black">Available at production launch</p></div><div className="rounded-xl border border-white/80 bg-white/94 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">Bank account</p><p className="mt-1 text-xs font-black">Payment logic currently disabled</p></div><div className="rounded-xl border border-white/80 bg-white/94 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">Cards</p><p className="mt-1 text-xs font-black">Will activate with payment phase</p></div></section>
  </CustomerWorkspaceShell>;
}
