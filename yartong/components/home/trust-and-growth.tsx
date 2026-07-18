import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/constants";

const stats = [
  ["Verified profiles", "Trust signals, reviews, and work history stay visible."],
  ["Local-first reach", "Discovery starts around Senapati and can expand later."],
  ["Business growth", "Providers get a clearer path from profile to enquiry."],
];

export function TrustAndGrowth() {
  return (
    <Section className="bg-[#07050D]">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-200/75">Trust-led marketplace</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Premium discovery without adding platform complexity.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            The homepage stays intentionally short while pointing customers toward workers, teams, materials, and quick jobs with mock-data previews only.
          </p>
          <Link href={ROUTES.postJob} className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-[#180722] shadow-lg shadow-fuchsia-500/20 hover:bg-fuchsia-100">
            Start with a job post
          </Link>
        </div>
        <div className="grid gap-4">
          {stats.map(([title, detail]) => (
            <Card key={title}>
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/62">{detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
