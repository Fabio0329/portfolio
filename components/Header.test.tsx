import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({ usePathname: () => "/blog" }));

describe("Header", () => {
  it("is the page banner, with a home link", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.name })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("has a labeled main navigation", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toHaveTextContent("About");
    expect(nav).toHaveTextContent("Projects");
    expect(nav).toHaveTextContent("Blog");
  });

  it("marks the current section", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Header />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
