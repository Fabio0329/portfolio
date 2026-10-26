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
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-5 text-sm">
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
