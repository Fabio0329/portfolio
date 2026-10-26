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
