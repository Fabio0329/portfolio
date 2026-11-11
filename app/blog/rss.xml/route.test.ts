import { describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import { GET } from "./route";

vi.mock("@/lib/content/posts", () => ({
  getPosts: async () => [
    {
      slug: "mdx-and-next",
      title: "MDX & Next.js <notes>",
      description: "What I learned",
      date: "2026-10-26",
      tags: ["nextjs", "mdx"],
    },
  ],
}));

describe("GET /blog/rss.xml", () => {
  it("serves RSS with the right content type", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
  });

  it("lists each post with escaped text and absolute links", async () => {
    const xml = await (await GET()).text();
    const url = `${site.url}/blog/mdx-and-next`;

    expect(xml).toContain("<title>MDX &amp; Next.js &lt;notes&gt;</title>");
    expect(xml).toContain(`<link>${url}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${url}</guid>`);
    expect(xml).toContain("<pubDate>Mon, 26 Oct 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>nextjs</category>");
    expect(xml).toContain("<category>mdx</category>");
  });

  it("points the feed's self link at its own absolute URL", async () => {
    const xml = await (await GET()).text();
    expect(xml).toContain(`<atom:link href="${site.url}/blog/rss.xml"`);
    expect(xml).not.toMatch(/https?:\/\/[^\s"<]*\/\//);
  });
});
