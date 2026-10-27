# Writing a case study

Each `.mdx` file in this folder becomes a page at `/projects/<filename>`.
Copy the template below into a new file, fill in the metadata, and write each
section. Set `draft: true` while writing: drafts show in `npm run dev` but are
left out of the production build.

Even for self-directed work, write it the way you'd document a customer
deployment. That's the skill a Forward Deployed Engineer role screens for.

```mdx
export const metadata = {
  title: "Project name",
  summary: "One or two sentences: what it is and who it's for.",
  status: "building", // or "shipped"
  date: "2026-10-27", // start date while building, ship date once shipped
  stack: ["Next.js", "TypeScript"],
  links: { live: "https://...", repo: "https://github.com/..." }, // optional
  draft: true,
};

## Problem and user

Who has the problem, what it costs them, and what "solved" looks like.

## Discovery and constraints

What you learned before building, and the limits you worked within
(time, budget, data, tools).

## Architecture

How the pieces fit. A diagram or a short flow helps.

## Build

Key decisions and trade-offs, not a changelog.

## Evaluation

How you know it works: tests, metrics, checks, feedback.

## Handoff

What a customer's team would need to run and extend it. What you'd do next
with a real customer.

## What I learned
```
