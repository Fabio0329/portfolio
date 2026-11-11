import type { Metadata } from "next";
import { PostList } from "@/components/blog/PostList";
import { getPosts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Short notes on what I'm building and learning.",
  alternates: {
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default async function LogPage() {
  const posts = await getPosts();

  return (
    <section>
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-3 text-muted">
          Learn with me: posts on what I&apos;m building and learning, and how
          to do it yourself.{" "}
          <a
            href="/blog/rss.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            RSS
          </a>
        </p>
      </header>
      <PostList posts={posts} />
    </section>
  );
}
