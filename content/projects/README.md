# Writing a case study

Each `.mdx` file in this folder becomes a page at `/projects/<filename>`.
Copy the template below into a new file, fill in the metadata, and write each
section. Set `draft: true` while writing: drafts show in `npm run dev` but are
left out of the production build.

Write each one as an overview: what the project is, what it does, and how it
works. Keep it descriptive, not a retrospective.

```mdx
export const metadata = {
  title: "Project name",
  summary: "One or two sentences: what it is and who it's for.",
  status: "building", // or "shipped"
  date: "2026-10-27", // start date while building, ship date once shipped
  stack: ["Next.js", "TypeScript"],
  links: { live: "https://...", repo: "https://github.com/..." }, // optional
  featured: true, // optional: show on the home page
  draft: true,
};

## Overview

What the project is and what it's for, in a few sentences.

## What's on it

The main features or parts, as a short list.

## How it works

How the pieces fit, with a diagram or short flow, plus the key design
decisions.

## Testing and deployment

How it's checked and shipped, and any results (tests, metrics, scores).
```
