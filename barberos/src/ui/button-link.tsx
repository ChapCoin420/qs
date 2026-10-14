import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost-dark" | "ghost-light";

const styles: Record<Variant, string> = {
  primary: "bg-brass text-ink hover:bg-[#d39a4d] border border-brass",
  "ghost-dark": "border border-linen/60 text-linen hover:border-linen hover:bg-linen/10",
  "ghost-light": "border border-ink/60 text-ink hover:border-ink hover:bg-ink/5",
};

interface Props {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

/** A link styled as a button. External URLs render a plain anchor. Min target 48px. */
export function ButtonLink({ href, children, variant = "primary", className = "" }: Props) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 px-7 text-base font-semibold motion-safe:transition-colors ${styles[variant]} ${className}`;
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
