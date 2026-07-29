"use client";

import { useState } from "react";

export function ShareProfileButton({ profilePath }: { profilePath: string }) {
  const [copied, setCopied] = useState(false);

  async function shareProfile() {
    const url = new URL(profilePath, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title: "Yartong labourer profile", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // User cancellation or unavailable clipboard should not block the dashboard.
    }
  }

  return (
    <button
      type="button"
      onClick={shareProfile}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm transition hover:border-violet-300"
    >
      {copied ? "Link copied" : "Share profile"}
    </button>
  );
}
