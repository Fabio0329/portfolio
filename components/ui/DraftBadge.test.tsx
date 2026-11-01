import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { DraftBadge } from "./DraftBadge";

describe("DraftBadge", () => {
  it("labels the content as a draft", () => {
    render(<DraftBadge />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DraftBadge />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
