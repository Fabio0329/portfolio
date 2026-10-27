import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/projects/CaseStudyLayout";
import { getProject, getProjects } from "@/lib/content/projects";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const { title, summary } = project.metadata;
  return {
    title,
    description: summary,
    openGraph: { type: "article", title, description: summary },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { Content, metadata } = project;

  return (
    <CaseStudyLayout project={metadata}>
      <Content />
    </CaseStudyLayout>
  );
}
