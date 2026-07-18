import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ children, className, interactive = false, ...props }: CardProps) {
  return <div className={["card", interactive ? "card--interactive" : "", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
