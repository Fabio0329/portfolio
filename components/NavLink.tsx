"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export const NavLink: FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "text-foreground"
          : "text-muted transition-colors hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
};
