import { Hero } from "@/components/home/Hero";
import { NowBlock } from "@/components/home/NowBlock";
import { SectionHeading } from "@/components/home/SectionHeading";
import { PostList } from "@/components/log/PostList";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getPosts } from "@/lib/content/posts";
import { getProjects } from "@/lib/content/projects";

export default async function Home() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const latestPosts = posts.slice(0, 3);
  const featured = projects.filter((project) => project.featured);

  // Sections with nothing to show are left out rather than shown empty.
  return (
    <div className="space-y-16">
      <Hero />
      <NowBlock />

      {featured.length > 0 && (
        <section aria-labelledby="featured-projects">
          <SectionHeading
            id="featured-projects"
            title="Featured projects"
            href="/projects"
            linkLabel="All projects"
          />
          <div className="grid gap-4">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section aria-labelledby="latest-posts">
          <SectionHeading
            id="latest-posts"
            title="Latest from the log"
            href="/log"
            linkLabel="All posts"
          />
          <PostList posts={latestPosts} headingLevel="h3" />
        </section>
      )}
    </div>
  );
}
