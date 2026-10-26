import type { PostMetadata } from "./types";

// MDX exports aren't type-checked, so check them here. Throwing fails the
// build loudly instead of shipping a post with missing fields.
export const validatePostMetadata = (
  slug: string,
  metadata: Partial<PostMetadata> | undefined,
): PostMetadata => {
  const file = `content/log/${slug}.mdx`;
  const { title, description, date, tags, draft } = metadata ?? {};

  if (!title || !description || !date || !Array.isArray(tags)) {
    throw new Error(
      `${file}: metadata needs title, description, date, and tags`,
    );
  }

  // Posts sort by comparing dates as strings, which only works for YYYY-MM-DD.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${file}: date must be YYYY-MM-DD`);
  }

  return { title, description, date, tags, draft };
};
