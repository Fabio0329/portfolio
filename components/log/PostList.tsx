import Link from "next/link";
import type { FC } from "react";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { TagList } from "@/components/ui/TagList";
import type { Post } from "@/lib/content/types";
import { formatDate } from "@/lib/dates";

type PostListProps = {
  posts: Post[];
};

export const PostList: FC<PostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return <p className="text-muted">No posts yet. The first one is coming.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.slug} className="py-6 first:pt-0">
          <article>
            <time dateTime={post.date} className="text-sm text-muted">
              {formatDate(post.date)}
            </time>
            <h2 className="mt-1 text-lg font-medium">
              <Link
                href={`/log/${post.slug}`}
                className="transition-colors hover:text-accent"
              >
                {post.title}
              </Link>
              {post.draft && <DraftBadge />}
            </h2>
            <p className="mt-1 text-muted">{post.description}</p>
            <TagList tags={post.tags} />
          </article>
        </li>
      ))}
    </ul>
  );
};
