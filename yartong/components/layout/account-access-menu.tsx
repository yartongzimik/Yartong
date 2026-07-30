"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { startRegistrationWithoutAuth } from "@/app/join/actions";
import { PUBLIC_ONBOARDING_ROLES, ROLE_LABELS, type PublicOnboardingRole } from "@/lib/onboarding";

const ROLE_ICONS: Record<PublicOnboardingRole, string> = {
  CUSTOMER: "👤",
  SKILLED_PROVIDER: "🛠",
  LABOURER: "◉",
  CONTRACTOR: "▦",
  MATERIAL_SUPPLIER: "▣",
};

export function AccountAccessMenu({ isPreviewAccess }: { isPreviewAccess: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePress = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsidePress);
    document.addEventListener("touchstart", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      document.removeEventListener("touchstart", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2.5 text-xs font-black text-slate-950 shadow-sm transition hover:bg-amber-300 active:scale-[0.97] sm:px-4"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 20c.8-4.1 3.3-6.2 7.5-6.2s6.7 2.1 7.5 6.2" />
        </svg>
        Register / Login
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choose your account type"
          className="fixed inset-x-3 top-[76px] z-50 mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:w-80 sm:max-w-none"
        >
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <h2 className="text-base font-black text-slate-950">Choose account type</h2>
            <button type="button" aria-label="Close account type menu" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">×</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {PUBLIC_ONBOARDING_ROLES.map((role, index) => {
              const rowClass = `flex min-h-12 w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold text-slate-900 transition hover:bg-slate-50 active:bg-slate-100 ${index ? "border-t border-slate-200" : ""}`;
              const row = (
                <>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm" aria-hidden="true">{ROLE_ICONS[role]}</span>
                  <span className="min-w-0 flex-1">{ROLE_LABELS[role]}</span>
                  <span aria-hidden="true" className="text-lg font-semibold text-slate-400">›</span>
                </>
              );

              if (isPreviewAccess) {
                return <form key={role} action={startRegistrationWithoutAuth.bind(null, role)}><button className={rowClass}>{row}</button></form>;
              }

              const callbackUrl = `/onboarding?role=${role}`;
              return <Link key={role} href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} onClick={() => setOpen(false)} className={rowClass}>{row}</Link>;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
