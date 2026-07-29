"use client";

import { useFormStatus } from "react-dom";

const ROLE_ICONS: Record<string, string> = {
  CUSTOMER: "⌂",
  SKILLED_PROVIDER: "⚒",
  LABOURER: "◉",
  CONTRACTOR: "▦",
  MATERIAL_SUPPLIER: "▣",
};

export function RoleChoiceButton({ role, label, description }: { role: string; label: string; description: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-4 text-left shadow-sm transition duration-150 active:scale-[0.985] active:border-fuchsia-200/80 active:bg-fuchsia-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 disabled:cursor-wait disabled:border-fuchsia-200/40 disabled:bg-fuchsia-400/10"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-300/10 text-lg font-black text-fuchsia-100 transition group-active:scale-95">
          {pending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-100/30 border-t-fuchsia-100" /> : ROLE_ICONS[role] ?? "→"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-white">{pending ? `Opening ${label}…` : label}</span>
          <span className="mt-1 block line-clamp-2 text-xs leading-5 text-white/52">{pending ? "Please wait while Yartong prepares your workspace." : description}</span>
        </span>
        <span aria-hidden="true" className={`shrink-0 text-xl font-black text-fuchsia-200 transition ${pending ? "opacity-0" : "group-hover:translate-x-1 group-active:translate-x-1"}`}>→</span>
      </span>
      {pending ? <span className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-white/10"><span className="block h-full w-1/2 animate-pulse bg-fuchsia-300" /></span> : null}
    </button>
  );
}
