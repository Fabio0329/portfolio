import Link from "next/link";
import type { FC } from "react";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { TagList } from "@/components/ui/TagList";
import type { Project } from "@/lib/content/types";
import { StatusBadge } from "./StatusBadge";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="relative rounded-lg border border-border p-5 transition-colors hover:border-muted">
      <StatusBadge status={project.status} />
      <h3 className="mt-2 text-lg font-medium">
        {/* The ::after overlay makes the whole card clickable while keeping
            a single, properly named link for screen readers. */}
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 after:rounded-lg"
        >
          {project.title}
        </Link>
        {project.draft && <DraftBadge />}
      </h3>
      <p className="mt-1 text-muted">{project.summary}</p>
      <TagList tags={project.stack} label="Tech stack" />
    </article>
  );
};
