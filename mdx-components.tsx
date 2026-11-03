import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Typography comes from the `prose` classes on the post page. Only elements
// that need behavior, not just styling, are overridden here.
export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    // Internal pages get client-side navigation. Files in public/ (anything
    // with an extension, like /resume.pdf) aren't pages, so they stay plain.
    const path = href.split(/[?#]/)[0];
    if (href.startsWith("/") && !/\.[a-z0-9]+$/i.test(path)) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    // Other sites open in a new tab; mailto: and #anchors stay as-is.
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
