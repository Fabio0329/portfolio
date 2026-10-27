import Link from "next/link";
import type { FC, ReactNode } from "react";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { TagList } from "@/components/ui/TagList";
import type { ProjectMetadata } from "@/lib/content/types";
import { formatDate } from "@/lib/dates";
import { StatusBadge } from "./StatusBadge";

type CaseStudyLayoutProps = {
  project: ProjectMetadata;
  children: ReactNode;
};

const linkClass =
  "text-sm font-medium text-accent underline-offset-4 hover:underline";

export const CaseStudyLayout: FC<CaseStudyLayoutProps> = ({
  project,
  children,
}) => {
  const { title, summary, status, date, stack, links, draft } = project;

  return (
    <article>
      <Link
        href="/projects"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden>←</span> Projects
      </Link>
      <header className="mt-8 mb-10">
        <div className="flex items-center gap-3 text-sm text-muted">
          <StatusBadge status={status} />
          <span aria-hidden>·</span>
          <span>
            {status === "shipped" ? "Shipped" : "Started"}{" "}
            <time dateTime={date}>{formatDate(date)}</time>
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {title}
          {draft && <DraftBadge />}
        </h1>
        <p className="mt-3 text-lg text-muted">{summary}</p>
        <TagList tags={stack} label="Tech stack" />
        {(links?.live || links?.repo) && (
          <div className="mt-5 flex gap-5">
            {links.live && (
              <a href={links.live} className={linkClass}>
                Live site <span aria-hidden>↗</span>
              </a>
            )}
            {links.repo && (
              <a href={links.repo} className={linkClass}>
                Source <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </header>
      <div className="prose max-w-none">{children}</div>
    </article>
  );
};
