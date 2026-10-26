import { readdir } from "node:fs/promises";
import path from "node:path";
import type { MDXContent } from "mdx/types";
import type { Post, PostMetadata } from "./types";
import { validatePostMetadata } from "./validate";

const logDir = path.join(process.cwd(), "content", "log");

// `npm run dev` shows drafts; `npm run build` leaves them out.
const showDrafts = process.env.NODE_ENV !== "production";

/** Visible posts, newest first. */
export const getPosts = async (): Promise<Post[]> => {
  const files = await readdir(logDir);
  const slugs = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await loadPost(slug);
      return { slug, ...metadata };
    }),
  );

  return posts
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
};

/** A single post with its compiled content, or null if missing or hidden. */
export const getPost = async (slug: string) => {
  // Go through getPosts so the draft rule applies to direct URLs too.
  const posts = await getPosts();
  if (!posts.some((post) => post.slug === slug)) return null;

  return loadPost(slug);
};

// The bundler compiles every .mdx file in content/log ahead of time, so any
// slug can be imported here. `default` is the post body as a component.
const loadPost = async (slug: string) => {
  const mod: { default: MDXContent; metadata?: Partial<PostMetadata> } =
    await import(`@/content/log/${slug}.mdx`);

  return {
    Content: mod.default,
    metadata: validatePostMetadata(slug, mod.metadata),
  };
};
