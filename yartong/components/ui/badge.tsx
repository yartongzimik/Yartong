import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "violet" | "magenta" | "neutral" | "trust";

const toneClasses: Record<BadgeTone, string> = {
  violet: "badge badge--violet",
  magenta: "badge badge--magenta",
  neutral: "badge badge--neutral",
  trust: "badge badge--trust",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, className, tone = "violet", ...props }: BadgeProps) {
  return <span className={[toneClasses[tone], className].filter(Boolean).join(" ")} {...props}>{children}</span>;
}
