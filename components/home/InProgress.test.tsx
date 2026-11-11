import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/dates";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { InProgress } from "./InProgress";

describe("InProgress", () => {
  it("is a section labeled by its heading", () => {
    render(<InProgress />);
    expect(
      screen.getByRole("region", { name: "In progress" }),
    ).toBeInTheDocument();
  });

  it("shows when it was last updated", () => {
    render(<InProgress />);
    expect(
      screen.getByText(formatDate(site.inProgress.updated)),
    ).toHaveAttribute("dateTime", site.inProgress.updated);
  });

  it("lists every item from site config", () => {
    render(<InProgress />);
    expect(screen.getAllByRole("listitem")).toHaveLength(
      site.inProgress.items.length,
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<InProgress />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
