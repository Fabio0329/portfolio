import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { TagList } from "./TagList";

describe("TagList", () => {
  it("renders nothing for an empty list", () => {
    const { container } = render(<TagList tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each tag in a labeled list", () => {
    render(<TagList tags={["React", "MDX"]} />);
    const list = screen.getByRole("list", { name: "Tags" });
    expect(list).toHaveTextContent("React");
    expect(list).toHaveTextContent("MDX");
  });

  it("accepts a custom label", () => {
    render(<TagList tags={["Next.js"]} label="Tech stack" />);
    expect(
      screen.getByRole("list", { name: "Tech stack" }),
    ).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TagList tags={["React", "MDX"]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
