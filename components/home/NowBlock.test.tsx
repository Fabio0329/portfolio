import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/dates";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { NowBlock } from "./NowBlock";

describe("NowBlock", () => {
  it("is a section labeled by its heading", () => {
    render(<NowBlock />);
    expect(screen.getByRole("region", { name: "Now" })).toBeInTheDocument();
  });

  it("shows when it was last updated", () => {
    render(<NowBlock />);
    expect(screen.getByText(formatDate(site.now.updated))).toHaveAttribute(
      "dateTime",
      site.now.updated,
    );
  });

  it("lists every item from site config", () => {
    render(<NowBlock />);
    expect(screen.getAllByRole("listitem")).toHaveLength(site.now.items.length);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NowBlock />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
