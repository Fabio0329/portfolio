import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { mdxComponents } from "./mdx-components";

// next/link renders a plain <a>, which looks the same as a regular link. Mark
// it so the tests can tell which links go through the client-side router.
vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) => (
    <a data-next-link="" {...props}>
      {children}
    </a>
  ),
}));

type AnchorProps = { href?: string; children: ReactNode };
const A = mdxComponents.a as ComponentType<AnchorProps>;

describe("MDX links", () => {
  it("send internal pages through the client-side router", () => {
    render(<A href="/blog/first">First post</A>);
    const link = screen.getByRole("link", { name: "First post" });
    expect(link).toHaveAttribute("href", "/blog/first");
    expect(link).toHaveAttribute("data-next-link");
    expect(link).not.toHaveAttribute("target");
  });

  it.each(["/resume.pdf", "/blog/rss.xml?x=1"])(
    "keep links to files, like %s, as plain links",
    (href) => {
      render(<A href={href}>file</A>);
      const link = screen.getByRole("link", { name: "file" });
      expect(link).toHaveAttribute("href", href);
      expect(link).not.toHaveAttribute("data-next-link");
      expect(link).not.toHaveAttribute("target");
    },
  );

  it("open other sites in a new tab, safely", () => {
    render(<A href="https://nextjs.org">Next.js</A>);
    const link = screen.getByRole("link", { name: "Next.js" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["mailto:fabio@fabiodev.io", "#build"])(
    "leave %s links in the same tab",
    (href) => {
      render(<A href={href}>link</A>);
      const link = screen.getByRole("link", { name: "link" });
      expect(link).toHaveAttribute("href", href);
      expect(link).not.toHaveAttribute("target");
    },
  );

  it("have no accessibility violations", async () => {
    const { container } = render(
      <p>
        See <A href="/blog">the blog</A> or{" "}
        <A href="https://nextjs.org">Next.js</A>.
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
