import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftBadge } from "@/components/log/DraftBadge";
import { TagList } from "@/components/log/TagList";
import { getPost, getPosts } from "@/lib/content/posts";
import { formatDate } from "@/lib/dates";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/log/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const { title, description, date, tags } = post.metadata;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: date,
      tags,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/log/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { Content, metadata } = post;

  return (
    <article>
      <Link
        href="/log"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Log
      </Link>
      <header className="mt-8 mb-10">
        <time dateTime={metadata.date} className="text-sm text-muted">
          {formatDate(metadata.date)}
        </time>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {metadata.title}
          {metadata.draft && <DraftBadge />}
        </h1>
        <TagList tags={metadata.tags} />
      </header>
      <div className="prose max-w-none">
        <Content />
      </div>
    </article>
  );
}
