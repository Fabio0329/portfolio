import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectMetadata } from "@/lib/content/types";
import { axe } from "@/test/axe";
import { CaseStudyLayout } from "./CaseStudyLayout";

const project: ProjectMetadata = {
  title: "This portfolio site",
  summary: "A fast, static portfolio.",
  status: "building",
  date: "2026-10-26",
  stack: ["Next.js"],
};

const renderLayout = (overrides: Partial<ProjectMetadata> = {}) =>
  render(
    <CaseStudyLayout project={{ ...project, ...overrides }}>
      <h2>Problem and user</h2>
    </CaseStudyLayout>,
  );

describe("CaseStudyLayout", () => {
  it("renders the title, summary, and body", () => {
    renderLayout();
    expect(
      screen.getByRole("heading", { level: 1, name: "This portfolio site" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A fast, static portfolio.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Problem and user" }),
    ).toBeInTheDocument();
  });

  // The label and the <time> are separate elements, so match the whole line.
  const dateLine = (text: string) =>
    screen.getByText(
      (_, element) =>
        element?.tagName === "SPAN" && element.textContent === text,
    );

  it('says "Started" while building and "Shipped" once shipped', () => {
    const { unmount } = renderLayout();
    expect(dateLine("Started Oct 26, 2026")).toBeInTheDocument();
    unmount();

    renderLayout({ status: "shipped" });
    expect(dateLine("Shipped Oct 26, 2026")).toBeInTheDocument();
  });

  it("links back to the projects page, without announcing the arrow", () => {
    renderLayout();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("renders live and source links only when they exist", () => {
    const { unmount } = renderLayout();
    expect(screen.queryByRole("link", { name: "Live site" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Source" })).toBeNull();
    unmount();

    renderLayout({
      links: { live: "https://example.com", repo: "https://github.com/x/y" },
    });
    expect(screen.getByRole("link", { name: "Live site" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
      "href",
      "https://github.com/x/y",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderLayout({
      links: { live: "https://example.com", repo: "https://github.com/x/y" },
      draft: true,
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
