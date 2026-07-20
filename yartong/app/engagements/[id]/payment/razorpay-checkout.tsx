"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { startPaymentCheckoutAction } from "./actions";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void };
  }
}

async function loadRazorpay() {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({ engagementId, name, email }: { engagementId: string; name?: string | null; email?: string | null }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function start() {
    try {
      setPending(true);
      setError(null);
      await loadRazorpay();
      const checkout = await startPaymentCheckoutAction(engagementId);
      if (!window.Razorpay) throw new Error("Razorpay Checkout is unavailable.");
      const instance = new window.Razorpay({
        key: checkout.keyId,
        order_id: checkout.providerOrderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Yartong",
        description: "Marketplace engagement payment",
        prefill: { name: name || undefined, email: email || undefined },
        handler: () => {
          router.refresh();
        },
        modal: { ondismiss: () => router.refresh() },
        theme: { color: "#9B4DFF" },
      });
      instance.open();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start payment checkout.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-5">
      <button type="button" onClick={start} disabled={pending} className="rounded-full bg-white px-6 py-3 font-black text-[#14091f] disabled:opacity-60">
        {pending ? "Starting secure checkout…" : "Pay securely with Razorpay"}
      </button>
      {error ? <p className="mt-3 text-sm text-rose-100">{error}</p> : null}
    </div>
  );
}
