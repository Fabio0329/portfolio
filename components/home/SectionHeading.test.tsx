import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { SectionHeading } from "./SectionHeading";

const renderHeading = () =>
  render(
    <SectionHeading
      id="latest-posts"
      title="Latest from the log"
      href="/log"
      linkLabel="All posts"
    />,
  );

describe("SectionHeading", () => {
  it("renders an h2 with the given id, for aria-labelledby", () => {
    renderHeading();
    expect(
      screen.getByRole("heading", { level: 2, name: "Latest from the log" }),
    ).toHaveAttribute("id", "latest-posts");
  });

  it("links to the full list, without announcing the arrow", () => {
    renderHeading();
    expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute(
      "href",
      "/log",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderHeading();
    expect(await axe(container)).toHaveNoViolations();
  });
});
