import {
  projectStatuses,
  type PostMetadata,
  type ProjectMetadata,
  type ProjectStatus,
} from "./types";

// MDX exports aren't type-checked, so check them here. Throwing fails the
// build loudly instead of shipping content with missing fields.

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
  checkDate(file, date);

  return { title, description, date, tags, draft };
};

export const validateProjectMetadata = (
  slug: string,
  metadata: Partial<ProjectMetadata> | undefined,
): ProjectMetadata => {
  const file = `content/projects/${slug}.mdx`;
  const { title, summary, status, date, stack, links, draft } = metadata ?? {};

  if (!title || !summary || !status || !date || !Array.isArray(stack)) {
    throw new Error(
      `${file}: metadata needs title, summary, status, date, and stack`,
    );
  }
  if (!projectStatuses.includes(status as ProjectStatus)) {
    throw new Error(
      `${file}: status must be one of ${projectStatuses.join(", ")}`,
    );
  }
  checkDate(file, date);

  return { title, summary, status, date, stack, links, draft };
};

// Content sorts by comparing dates as strings, which only works for YYYY-MM-DD.
const checkDate = (file: string, date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${file}: date must be YYYY-MM-DD`);
  }
};
