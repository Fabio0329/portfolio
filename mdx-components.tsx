import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Typography comes from the `prose` classes on the post page. Only elements
// that need behavior, not just styling, are overridden here.
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    // Internal pages get client-side navigation.
    if (href.startsWith("/")) {
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
  return components;
}
