// Single source of truth for identity, links, and the "In progress" block.
export const site = {
  name: "Fabio Restrepo",
  title: "Software Engineer",
  pitch: "I turn fuzzy problems into shipped AI products.",
  intro:
    "I've spent 5+ years building products people use every day as a full-stack engineer. Now I'm embracing modern agentic development practices and moving toward Forward Deployed Engineering: working directly with customers to understand their needs and delivering practical, AI-powered solutions that solve real-world problems.",
  description:
    "Full-stack engineer embracing agentic development to build and ship AI-powered solutions end to end.",
  url: "https://fabiodev.io",
  email: "fabio@fabiodev.io",
  links: {
    github: "https://github.com/Fabio0329",
    linkedin: "https://www.linkedin.com/in/fabiorestrepo",
    resume: "/resume.pdf",
  },
  inProgress: {
    updated: "2026-11-11",
    items: [
      "World of Warcraft Forever guild management site",
      "Best practices in agentic coding: agent loops, tool use, and evals with the Claude API",
    ],
  },
} as const;
