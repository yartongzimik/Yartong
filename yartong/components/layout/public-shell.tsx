import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07050D] text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
