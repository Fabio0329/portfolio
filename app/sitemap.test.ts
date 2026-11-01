import { describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import sitemap from "./sitemap";

vi.mock("@/lib/content/posts", () => ({
  getPosts: async () => [{ slug: "first-post", date: "2026-10-26" }],
}));

vi.mock("@/lib/content/projects", () => ({
  getProjects: async () => [{ slug: "portfolio-site", date: "2026-10-20" }],
}));

describe("sitemap", () => {
  it("lists the main pages, projects, and posts", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toEqual([
      site.url,
      `${site.url}/about`,
      `${site.url}/projects`,
      `${site.url}/log`,
      `${site.url}/projects/portfolio-site`,
      `${site.url}/log/first-post`,
    ]);
  });

  it("uses content dates as lastModified", async () => {
    const entries = await sitemap();
    expect(entries.find((e) => e.url.endsWith("/first-post"))).toMatchObject({
      lastModified: "2026-10-26",
    });
  });

  it("never produces a double slash in a path", async () => {
    for (const { url } of await sitemap()) {
      expect(new URL(url).pathname).not.toContain("//");
    }
  });
});
