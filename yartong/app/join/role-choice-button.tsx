"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const ROLE_ICONS: Record<string, string> = {
  CUSTOMER: "⌂",
  SKILLED_PROVIDER: "⚒",
  LABOURER: "◉",
  CONTRACTOR: "▦",
  MATERIAL_SUPPLIER: "▣",
};

type NetworkInformation = EventTarget & {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
};

type NetworkSnapshot = {
  online: boolean;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
};

function readNetwork(): NetworkSnapshot {
  if (typeof navigator === "undefined") return { online: true };
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return {
    online: navigator.onLine,
    downlink: connection?.downlink,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

function loadingMessage(elapsedMs: number, network: NetworkSnapshot) {
  if (!network.online) return "Your device appears to be offline. Yartong will continue when the connection returns.";
  if (elapsedMs < 1500) return "Request received. Connecting to Yartong…";
  if (elapsedMs < 4000) return "Loading your account and workspace data…";

  const slowConnection =
    network.effectiveType === "slow-2g" ||
    network.effectiveType === "2g" ||
    (typeof network.downlink === "number" && network.downlink < 1.5) ||
    (typeof network.rtt === "number" && network.rtt > 600);

  if (slowConnection) return "Your network currently looks slow, so this may take a little longer.";
  if (elapsedMs < 8000) return "Yartong is still preparing the workspace on the server…";
  return "This is taking longer than usual. Your connection is online; Yartong is still waiting for the server response.";
}

function NetworkDetails({ network, elapsedMs }: { network: NetworkSnapshot; elapsedMs: number }) {
  const details: string[] = [network.online ? "Online" : "Offline"];
  if (network.effectiveType) details.push(network.effectiveType.toUpperCase());
  if (typeof network.downlink === "number") details.push(`~${network.downlink.toFixed(1)} Mbps`);
  if (typeof network.rtt === "number") details.push(`~${network.rtt} ms RTT`);
  if (network.saveData) details.push("Data Saver");
  details.push(`${(elapsedMs / 1000).toFixed(1)}s`);

  return <span className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.08em] text-fuchsia-100/55">{details.map((detail) => <span key={detail}>{detail}</span>)}</span>;
}

export function RoleChoiceButton({ role, label, description }: { role: string; label: string; description: string }) {
  const { pending } = useFormStatus();
  const [elapsedMs, setElapsedMs] = useState(0);
  const [network, setNetwork] = useState<NetworkSnapshot>(() => readNetwork());

  useEffect(() => {
    if (!pending) return;

    const startedAt = performance.now();
    const update = () => {
      setElapsedMs(performance.now() - startedAt);
      setNetwork(readNetwork());
    };

    const timer = window.setInterval(update, 250);
    const handleNetworkChange = () => setNetwork(readNetwork());
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    connection?.addEventListener("change", handleNetworkChange);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
      connection?.removeEventListener("change", handleNetworkChange);
    };
  }, [pending]);

  const handlePress = () => {
    setElapsedMs(0);
    setNetwork(readNetwork());
  };

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={handlePress}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-4 text-left shadow-sm transition duration-150 active:scale-[0.985] active:border-fuchsia-200/80 active:bg-fuchsia-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 disabled:cursor-wait disabled:border-fuchsia-200/45 disabled:bg-fuchsia-400/10"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-300/10 text-lg font-black text-fuchsia-100 transition group-active:scale-95">
          {pending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-100/30 border-t-fuchsia-100" /> : ROLE_ICONS[role] ?? "→"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-white">{pending ? `Opening ${label}…` : label}</span>
          <span className={`mt-1 block text-xs leading-5 ${pending ? "text-white/65" : "line-clamp-2 text-white/52"}`}>
            {pending ? loadingMessage(elapsedMs, network) : description}
          </span>
          {pending ? <NetworkDetails network={network} elapsedMs={elapsedMs} /> : null}
        </span>
        <span aria-hidden="true" className={`shrink-0 text-xl font-black text-fuchsia-200 transition ${pending ? "opacity-0" : "group-hover:translate-x-1 group-active:translate-x-1"}`}>→</span>
      </span>
      {pending ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-white/10">
          <span className="block h-full w-1/2 animate-pulse bg-fuchsia-300" />
        </span>
      ) : null}
    </button>
  );
}
