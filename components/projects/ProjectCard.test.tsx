import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/content/types";
import { axe } from "@/test/axe";
import { ProjectCard } from "./ProjectCard";

const project: Project = {
  slug: "portfolio-site",
  title: "This portfolio site",
  summary: "A fast, static portfolio.",
  status: "building",
  date: "2026-10-26",
  stack: ["Next.js", "MDX"],
};

describe("ProjectCard", () => {
  it("has exactly one link, named by the project title", () => {
    render(<ProjectCard project={project} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("This portfolio site");
    expect(links[0]).toHaveAttribute("href", "/projects/portfolio-site");
  });

  it("shows the status, summary, and tech stack", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Building")).toBeInTheDocument();
    expect(screen.getByText("A fast, static portfolio.")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Tech stack" })).toHaveTextContent(
      "Next.js",
    );
  });

  it("shows a draft badge only for drafts", () => {
    const { unmount } = render(<ProjectCard project={project} />);
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
    unmount();

    render(<ProjectCard project={{ ...project, draft: true }} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProjectCard project={project} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
