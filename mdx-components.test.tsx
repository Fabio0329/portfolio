import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { mdxComponents } from "./mdx-components";

type AnchorProps = { href?: string; children: ReactNode };
const A = mdxComponents.a as ComponentType<AnchorProps>;

describe("MDX links", () => {
  it("keep internal links in the same tab", () => {
    render(<A href="/log/first">First post</A>);
    const link = screen.getByRole("link", { name: "First post" });
    expect(link).toHaveAttribute("href", "/log/first");
    expect(link).not.toHaveAttribute("target");
  });

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
        See <A href="/log">the log</A> or{" "}
        <A href="https://nextjs.org">Next.js</A>.
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
