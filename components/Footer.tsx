import type { FC } from "react";
import { site } from "@/lib/site";
import { CopyEmailButton } from "./CopyEmailButton";

const linkClass = "text-muted transition-colors hover:text-foreground";

export const Footer: FC = () => {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="page-container flex flex-col gap-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${site.email}`} className="font-medium">
            {site.email}
          </a>
          <CopyEmailButton email={site.email} />
        </div>
        <ul className="flex flex-wrap gap-5">
          <li>
            <a href={site.links.github} className={linkClass}>
              GitHub
            </a>
          </li>
          <li>
            <a href={site.links.linkedin} className={linkClass}>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.links.resume} className={linkClass}>
              Resume
            </a>
          </li>
        </ul>
      </div>
      <p className="page-container pb-10 text-xs text-muted">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
};
