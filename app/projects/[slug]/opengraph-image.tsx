import { getProject, getProjects } from "@/lib/content/projects";
import { ogSize, renderOgCard } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  return renderOgCard({
    eyebrow: "Project",
    title: project?.metadata.title ?? "Project",
    subtitle: project?.metadata.summary,
  });
}
