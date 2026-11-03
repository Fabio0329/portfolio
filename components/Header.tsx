import Link from "next/link";
import type { FC } from "react";
import { site } from "@/lib/site";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/log", label: "Log" },
];

export const Header: FC = () => {
  return (
    <header className="border-b border-border">
      {/* One row down to 360px. Narrower than that (WCAG reflow goes down to
          320px), the nav wraps onto its own row instead of overflowing. */}
      <div className="page-container flex min-h-16 flex-wrap items-center justify-between gap-x-3 py-2">
        <Link
          href="/"
          className="font-semibold tracking-tight whitespace-nowrap"
        >
          {site.name}
        </Link>
        <nav
          aria-label="Main"
          className="flex items-center gap-3 text-sm sm:gap-5"
        >
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
