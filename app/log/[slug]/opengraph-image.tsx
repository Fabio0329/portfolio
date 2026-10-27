import { getPost, getPosts } from "@/lib/content/posts";
import { ogSize, renderOgCard } from "@/lib/og";

export const alt = "Log post";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return renderOgCard({
    eyebrow: "Log",
    title: post?.metadata.title ?? "Log",
    subtitle: post?.metadata.description,
  });
}
