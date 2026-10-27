import { readdir } from "node:fs/promises";
import path from "node:path";

// `npm run dev` shows drafts; `npm run build` leaves them out.
const showDrafts = process.env.NODE_ENV !== "production";

/** Slugs for every .mdx file in a content folder, e.g. "log". */
export const listSlugs = async (folder: string) => {
  const files = await readdir(path.join(process.cwd(), "content", folder));
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
};

/** Whether content should appear on the site in the current build. */
export const isVisible = (metadata: { draft?: boolean }) =>
  showDrafts || !metadata.draft;
