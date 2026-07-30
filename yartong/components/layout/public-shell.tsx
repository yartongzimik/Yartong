import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function PublicShell({ children, workspace = false }: { children: ReactNode; workspace?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <Header />
      <main data-workspace={workspace || undefined}>{children}</main>
      <Footer />
    </div>
  );
}
