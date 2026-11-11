import { getPosts } from "@/lib/content/posts";
import { site } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

// Route handlers aren't cached by default; build this one once at build time.
export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const feedUrl = `${site.url}/blog/rss.xml`;

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escapeXml(post.description)}</description>
  <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
  ${categories}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(`${site.name} · Blog`)}</title>
  <link>${site.url}/blog</link>
  <description>${escapeXml(site.description)}</description>
  <language>en</language>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
