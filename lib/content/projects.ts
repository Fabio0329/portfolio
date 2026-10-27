import type { MDXContent } from "mdx/types";
import { isVisible, listSlugs } from "./listing";
import type { Project, ProjectMetadata } from "./types";
import { validateProjectMetadata } from "./validate";

/** Visible projects, newest first. */
export const getProjects = async (): Promise<Project[]> => {
  const slugs = await listSlugs("projects");

  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await loadProject(slug);
      return { slug, ...metadata };
    }),
  );

  return projects
    .filter(isVisible)
    .sort((a, b) => b.date.localeCompare(a.date));
};

/** A single project with its compiled case study, or null if missing or hidden. */
export const getProject = async (slug: string) => {
  // Go through getProjects so the draft rule applies to direct URLs too.
  const projects = await getProjects();
  if (!projects.some((project) => project.slug === slug)) return null;

  return loadProject(slug);
};

// Same as posts: the bundler compiles every .mdx file in content/projects.
// The import path has to be written out here (not passed in) so it knows
// which folder to compile.
const loadProject = async (slug: string) => {
  const mod: { default: MDXContent; metadata?: Partial<ProjectMetadata> } =
    await import(`@/content/projects/${slug}.mdx`);

  return {
    Content: mod.default,
    metadata: validateProjectMetadata(slug, mod.metadata),
  };
};
