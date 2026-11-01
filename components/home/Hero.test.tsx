import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("leads with the pitch as the page's only h1", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      site.pitch,
    );
    expect(screen.getByText(site.intro)).toBeInTheDocument();
  });

  it("links to the resume, email, GitHub, and LinkedIn from site config", () => {
    render(<Hero />);
    const href = (name: string) =>
      screen.getByRole("link", { name }).getAttribute("href");

    expect(href("Resume")).toBe(site.links.resume);
    expect(href("Email")).toBe(`mailto:${site.email}`);
    expect(href("GitHub")).toBe(site.links.github);
    expect(href("LinkedIn")).toBe(site.links.linkedin);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Hero />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
