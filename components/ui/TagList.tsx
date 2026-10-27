import type { FC } from "react";

type TagListProps = {
  tags: string[];
  /** Screen reader label for the list, e.g. "Tech stack". */
  label?: string;
};

export const TagList: FC<TagListProps> = ({ tags, label = "Tags" }) => {
  if (tags.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label={label}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
};
