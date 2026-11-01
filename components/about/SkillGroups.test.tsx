import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { SkillGroups } from "./SkillGroups";

const renderGroups = () =>
  render(
    <SkillGroups
      deep={["React", "TypeScript"]}
      working={["Node.js"]}
      learning={["LLM evals"]}
    />,
  );

describe("SkillGroups", () => {
  it("renders the three groups as h3 headings", () => {
    renderGroups();
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Deep", "Working", "Learning"]);
  });

  it("lists every skill", () => {
    renderGroups();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      ["React", "TypeScript", "Node.js", "LLM evals"],
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderGroups();
    expect(await axe(container)).toHaveNoViolations();
  });
});
