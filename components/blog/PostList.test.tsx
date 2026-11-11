import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/content/types";
import { axe } from "@/test/axe";
import { PostList } from "./PostList";

const posts: Post[] = [
  {
    slug: "second",
    title: "Second post",
    description: "Newer",
    date: "2026-10-27",
    tags: ["nextjs"],
    draft: true,
  },
  {
    slug: "first",
    title: "First post",
    description: "Older",
    date: "2026-10-26",
    tags: [],
  },
];

describe("PostList", () => {
  it("shows a message when there are no posts", () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("links each post to its page", () => {
    render(<PostList posts={posts} />);
    expect(screen.getByRole("link", { name: "First post" })).toHaveAttribute(
      "href",
      "/blog/first",
    );
    expect(screen.getByRole("link", { name: "Second post" })).toHaveAttribute(
      "href",
      "/blog/second",
    );
  });

  it("uses h2 titles by default and h3 when nested under a section", () => {
    const { unmount } = render(<PostList posts={posts} />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    unmount();

    render(<PostList posts={posts} headingLevel="h3" />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("marks only drafts with a badge", () => {
    render(<PostList posts={posts} />);
    const [draft, published] = screen.getAllByRole("article");
    expect(within(draft).getByText("Draft")).toBeInTheDocument();
    expect(within(published).queryByText("Draft")).not.toBeInTheDocument();
  });

  it("shows a machine-readable date", () => {
    render(<PostList posts={posts} />);
    expect(screen.getByText("Oct 26, 2026")).toHaveAttribute(
      "dateTime",
      "2026-10-26",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PostList posts={posts} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
