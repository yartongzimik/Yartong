import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  ghost: "btn btn--ghost",
  outline: "btn btn--outline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonLinkProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function buttonClassName({ className, variant = "primary", size = "md" }: Pick<BaseButtonProps, "className" | "variant" | "size">) {
  return [variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(" ");
}

export function Button({ children, className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return <button className={buttonClassName({ className, variant, size })} type={type} {...props}>{children}</button>;
}

export function ButtonLink({ children, className, variant = "primary", size = "md", href, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ className, variant, size })} href={href} {...props}>{children}</Link>;
}
