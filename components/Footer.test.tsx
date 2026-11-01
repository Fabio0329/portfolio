import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("is the page's contentinfo landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("offers email by link and by copy button", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
    expect(
      screen.getByRole("button", { name: "Copy email" }),
    ).toBeInTheDocument();
  });

  it("links to GitHub, LinkedIn, and the resume", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      site.links.github,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      site.links.linkedin,
    );
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "href",
      site.links.resume,
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
