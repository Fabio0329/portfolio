// Single source of truth for identity, links, and the "Now" block.
// TODO(fabio): replace placeholder values before launch.
export const site = {
  name: "Fabio",
  title: "Software Engineer",
  pitch: "I turn fuzzy problems into shipped AI products.",
  intro:
    "I've spent 5+ years building products people use every day, mostly on the frontend. Now I'm moving into Forward Deployed Engineering: working with customers to find what they actually need, then shipping the AI tools that solve it.",
  description:
    "Software engineer focused on shipping AI-powered products end to end.",
  url: "https://example.com",
  email: "hello@example.com",
  links: {
    github: "https://github.com/your-handle",
    linkedin: "https://www.linkedin.com/in/your-handle",
    resume: "/resume.pdf",
  },
  now: {
    updated: "2026-10-26",
    items: [
      "Building this site in public with Next.js",
      "Learning tool use and evals with the Claude API",
    ],
  },
} as const;
