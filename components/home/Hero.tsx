import type { FC } from "react";
import { site } from "@/lib/site";

const secondaryLinkClass =
  "rounded-md border border-border px-4 py-2 font-medium transition-colors hover:border-muted";

export const Hero: FC = () => {
  return (
    <section>
      <p className="text-sm font-medium text-muted">
        {site.name} · {site.title}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {site.pitch}
      </h1>
      <p className="mt-6 text-lg text-muted">{site.intro}</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <a
          href={site.links.resume}
          className="rounded-md bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-85"
        >
          Resume
        </a>
        <a href={`mailto:${site.email}`} className={secondaryLinkClass}>
          Email
        </a>
        <a href={site.links.github} className={secondaryLinkClass}>
          GitHub
        </a>
        <a href={site.links.linkedin} className={secondaryLinkClass}>
          LinkedIn
        </a>
      </div>
    </section>
  );
};
