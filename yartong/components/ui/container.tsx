import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}

export function Container({ children, className, size = "xl", ...props }: ContainerProps) {
  return <div className={["container", `container--${size}`, className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
