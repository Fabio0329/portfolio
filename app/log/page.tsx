import type { Metadata } from "next";
import { PostList } from "@/components/log/PostList";
import { getPosts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Log",
  description: "Short notes on what I'm building and learning.",
  alternates: {
    types: { "application/rss+xml": "/log/rss.xml" },
  },
};

export default async function LogPage() {
  const posts = await getPosts();

  return (
    <section>
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Log</h1>
        <p className="mt-3 text-muted">
          Short notes on what I&apos;m building and learning, written as I go.{" "}
          <a
            href="/log/rss.xml"
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
