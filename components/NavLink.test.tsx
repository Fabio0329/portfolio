import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { NavLink } from "./NavLink";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const renderLink = () => render(<NavLink href="/log">Log</NavLink>);

describe("NavLink", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  it("marks the link current on its own page", () => {
    pathname.current = "/log";
    renderLink();
    expect(screen.getByRole("link", { name: "Log" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("stays current on pages nested under it", () => {
    pathname.current = "/log/some-post";
    renderLink();
    expect(screen.getByRole("link", { name: "Log" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("isn't current elsewhere, including look-alike paths", () => {
    for (const path of ["/", "/about", "/logbook"]) {
      pathname.current = path;
      const { unmount } = renderLink();
      expect(screen.getByRole("link", { name: "Log" })).not.toHaveAttribute(
        "aria-current",
      );
      unmount();
    }
  });

  it("has no accessibility violations", async () => {
    pathname.current = "/log";
    const { container } = renderLink();
    expect(await axe(container)).toHaveNoViolations();
  });
});
