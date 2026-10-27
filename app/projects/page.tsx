import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies written the way I'd document a customer deployment.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const building = projects.filter((project) => project.status === "building");
  const shipped = projects.filter((project) => project.status === "shipped");

  return (
    <section>
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-muted">
          Each one is written up like a customer deployment: the problem, the
          constraints, how I built it, and how I know it works.
        </p>
      </header>

      {projects.length === 0 && (
        <p className="text-muted">Case studies are on the way.</p>
      )}

      {building.length > 0 && (
        <section aria-labelledby="building-now" className="mb-12">
          <h2 id="building-now" className="mb-4 text-lg font-medium">
            Building now
          </h2>
          <div className="grid gap-4">
            {building.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {shipped.length > 0 && (
        <section aria-labelledby="shipped">
          <h2 id="shipped" className="mb-4 text-lg font-medium">
            Shipped
          </h2>
          <div className="grid gap-4">
            {shipped.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
