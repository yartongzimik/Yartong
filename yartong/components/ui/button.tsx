import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
} as const;

type Variant = keyof typeof variants;

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${variants[variant]} ${className}`.trim()} {...props} />;
}

export function ButtonLink({ href, children, variant = "primary", className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; variant?: Variant }) {
  return (
    <Link className={`${variants[variant]} ${className}`.trim()} href={href} {...props}>
      {children}
    </Link>
  );
}
