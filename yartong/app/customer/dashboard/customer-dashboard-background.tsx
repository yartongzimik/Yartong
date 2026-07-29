"use client";

import { useEffect, useState } from "react";

type ConnectionInfo = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
};

const BACKGROUND_URL = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=82";

export function CustomerDashboardBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection;
    const slow =
      !navigator.onLine ||
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g" ||
      (typeof connection?.downlink === "number" && connection.downlink < 1.5) ||
      (typeof connection?.rtt === "number" && connection.rtt > 650);

    if (slow) return;

    const timer = window.setTimeout(() => setEnabled(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(247,249,252,.70),rgba(247,249,252,.78)),url(${BACKGROUND_URL})` }}
    />
  );
}
