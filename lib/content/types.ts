// Every post in content/log/*.mdx exports this as `metadata`.
export type PostMetadata = {
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  /** Drafts render in dev but are left out of production builds. */
  draft?: boolean;
};

// The slug isn't written in the post. It comes from the filename:
// content/log/hello-world.mdx -> /log/hello-world
export type Post = PostMetadata & { slug: string };

export const projectStatuses = ["building", "shipped"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

// Every case study in content/projects/*.mdx exports this as `metadata`.
export type ProjectMetadata = {
  title: string;
  /** One or two sentences for the card and the page header. */
  summary: string;
  status: ProjectStatus;
  /** Ship date, or start date while building. ISO date, YYYY-MM-DD */
  date: string;
  stack: string[];
  links?: {
    live?: string;
    repo?: string;
  };
  draft?: boolean;
};

// Same rule as posts: content/projects/my-app.mdx -> /projects/my-app
export type Project = ProjectMetadata & { slug: string };
