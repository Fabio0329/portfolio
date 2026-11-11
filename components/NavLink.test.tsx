import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { NavLink } from "./NavLink";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

const renderLink = () => render(<NavLink href="/blog">Blog</NavLink>);

describe("NavLink", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  it("marks the link current on its own page", () => {
    pathname.current = "/blog";
    renderLink();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("stays current on pages nested under it", () => {
    pathname.current = "/blog/some-post";
    renderLink();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("isn't current elsewhere, including look-alike paths", () => {
    for (const path of ["/", "/about", "/blogroll"]) {
      pathname.current = path;
      const { unmount } = renderLink();
      expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
        "aria-current",
      );
      unmount();
    }
  });

  it("has no accessibility violations", async () => {
    pathname.current = "/blog";
    const { container } = renderLink();
    expect(await axe(container)).toHaveNoViolations();
  });
});
