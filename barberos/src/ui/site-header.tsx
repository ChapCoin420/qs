"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { booking, nav } from "@/content/site";
import { Wordmark } from "./wordmark";

/** Sticky header. On small screens the nav collapses into a disclosure menu (Esc closes, focus returns). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls = (href: string) =>
    `relative py-2 text-base font-medium hover:text-brass motion-safe:transition-colors ${
      pathname === href ? "text-brass" : "text-linen"
    }`;

  return (
    <header className="surface-dark sticky top-0 z-40 border-b border-linen/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="text-linen">
          <Wordmark />
          <span className="sr-only"> — דף הבית</span>
        </Link>

        <nav aria-label="ראשי" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkCls(item.href)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={booking.url}
            className="hidden min-h-11 items-center bg-brass px-5 text-sm font-semibold text-ink hover:bg-[#d39a4d] sm:inline-flex motion-safe:transition-colors"
          >
            {booking.label}
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-linen md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-base font-medium">{open ? "סגירה" : "תפריט"}</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="ראשי"
        hidden={!open}
        className="border-t border-linen/10 md:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-12 items-center font-display text-2xl ${pathname === item.href ? "text-brass" : "text-linen"}`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-4">
            <a
              href={booking.url}
              className="flex min-h-12 items-center justify-center bg-brass font-semibold text-ink"
            >
              {booking.label}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
