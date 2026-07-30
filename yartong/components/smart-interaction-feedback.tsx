"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Feedback = {
  message: string;
  detail: string;
  navigation: boolean;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function readableLabel(element: HTMLElement) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent?.replace(/\s+/g, " ").trim() ||
    "Action"
  ).slice(0, 52);
}

export function SmartInteractionFeedback() {
  const pathname = usePathname();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const activeElement = useRef<HTMLElement | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
      activeElement.current?.classList.remove("yt-smart-active");
      activeElement.current?.removeAttribute("aria-busy");
      activeElement.current = null;
      setFeedback(null);
    };

    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) return;

      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("a, button, [role='button']") : null;
      if (!target || target.closest("[data-yartong-managed-feedback='true']")) return;
      if (target.matches(":disabled, [aria-disabled='true']")) return;

      const anchor = target instanceof HTMLAnchorElement ? target : target.closest<HTMLAnchorElement>("a");
      if (anchor?.hasAttribute("download")) return;

      const href = anchor?.getAttribute("href") || "";
      const isExternalProtocol = /^(mailto:|tel:|sms:)/i.test(href);
      const isHashOnly = href.startsWith("#");
      const isNavigation = Boolean(anchor && href && !isExternalProtocol && !isHashOnly);
      const isSubmit = target instanceof HTMLButtonElement && (target.type === "submit" || target.closest("form"));

      if (timer.current) window.clearTimeout(timer.current);
      activeElement.current?.classList.remove("yt-smart-active");
      activeElement.current?.removeAttribute("aria-busy");

      activeElement.current = target;
      target.classList.add("yt-smart-active");
      target.setAttribute("aria-busy", "true");

      const label = readableLabel(target);
      setFeedback({
        message: isNavigation ? `Opening ${label}…` : isSubmit ? `Processing ${label}…` : `${label} selected`,
        detail: isNavigation || isSubmit ? "Your tap was received. Please wait." : "Tap registered.",
        navigation: isNavigation || Boolean(isSubmit),
      });

      timer.current = window.setTimeout(clear, isNavigation || isSubmit ? 8000 : 1100);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("pagehide", clear);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("pagehide", clear);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
      activeElement.current?.classList.remove("yt-smart-active");
      activeElement.current?.removeAttribute("aria-busy");
      activeElement.current = null;
      setFeedback(null);
    });
  }, [pathname]);

  if (!feedback) return null;

  return (
    <div className="yt-smart-feedback" role="status" aria-live="polite">
      <span className={feedback.navigation ? "yt-smart-feedback-spinner" : "yt-smart-feedback-check"} aria-hidden="true">
        {feedback.navigation ? "" : "✓"}
      </span>
      <span className="min-w-0">
        <strong>{feedback.message}</strong>
        <small>{feedback.detail}</small>
      </span>
    </div>
  );
}
