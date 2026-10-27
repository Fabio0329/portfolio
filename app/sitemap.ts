import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content/posts";
import { getProjects } from "@/lib/content/projects";
import { site } from "@/lib/site";

// Built once at build time. Drafts are already filtered out by the loaders.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const pages = ["", "/about", "/projects", "/log"].map((path) => ({
    url: `${site.url}${path}`,
  }));

  return [
    ...pages,
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: project.date,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/log/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
