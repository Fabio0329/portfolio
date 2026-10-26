"use client";

import { useLayoutEffect, type FC } from "react";
import { getTheme, THEME_STORAGE_KEY } from "@/lib/theme";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";

export const ThemeToggle: FC = () => {
  // Re-apply after React's dev-only remount clears data-theme. No-op in production.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", getTheme());
  }, []);

  const toggle = () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
  };

  // Both icons render; CSS shows the right one, so server and client markup match.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </button>
  );
};
