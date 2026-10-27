import type { MDXContent } from "mdx/types";
import { isVisible, listSlugs } from "./listing";
import type { Post, PostMetadata } from "./types";
import { validatePostMetadata } from "./validate";

/** Visible posts, newest first. */
export const getPosts = async (): Promise<Post[]> => {
  const slugs = await listSlugs("log");

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await loadPost(slug);
      return { slug, ...metadata };
    }),
  );

  return posts.filter(isVisible).sort((a, b) => b.date.localeCompare(a.date));
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
