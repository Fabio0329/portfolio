import Link from "next/link";
import type { FC } from "react";

type SectionHeadingProps = {
  id: string;
  title: string;
  href: string;
  linkLabel: string;
};

export const SectionHeading: FC<SectionHeadingProps> = ({
  id,
  title,
  href,
  linkLabel,
}) => {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-lg font-medium">
        {title}
      </h2>
      <Link
        href={href}
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        {linkLabel} →
      </Link>
    </div>
  );
};
