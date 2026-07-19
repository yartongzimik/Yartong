import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

export default function ProviderNotFound() {
  return <PublicShell><main className="mx-auto w-full max-w-4xl px-6 py-20 text-white sm:px-8"><h1 className="text-4xl font-black">Provider profile not found</h1><p className="mt-4 text-white/65">This profile may not exist, may not be active, or may not be eligible for public marketplace listing.</p><Link href="/workers" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-black text-[#14091f]">Browse workers</Link></main></PublicShell>;
}
