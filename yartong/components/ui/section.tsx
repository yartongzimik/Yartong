import type { HTMLAttributes, ReactNode } from "react";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function Section({ children, className, eyebrow, title, description, ...props }: SectionProps) {
  return (
    <section className={["section", className].filter(Boolean).join(" ")} {...props}>
      {(eyebrow || title || description) && (
        <div className="section__header">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}
