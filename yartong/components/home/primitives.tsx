import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section className={`home-section ${className}`.trim()} id={id}>{children}</section>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card ${className}`.trim()}>{children}</div>;
}
