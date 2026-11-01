import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { axe } from "@/test/axe";
import { ThemeToggle } from "./ThemeToggle";

// jsdom has no matchMedia. Pretend the OS prefers light mode.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false } as MediaQueryList),
  );
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

const toggle = () =>
  fireEvent.click(screen.getByRole("button", { name: "Toggle dark mode" }));

describe("ThemeToggle", () => {
  it("applies the stored or system theme on mount", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(<ThemeToggle />);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("switches between light and dark and remembers the choice", () => {
    render(<ThemeToggle />);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    toggle();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    toggle();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
