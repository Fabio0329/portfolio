import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["building", "Building"],
    ["shipped", "Shipped"],
  ] as const)("labels %s projects", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("hides the decorative dot from screen readers", () => {
    const { container } = render(<StatusBadge status="building" />);
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<StatusBadge status="shipped" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
