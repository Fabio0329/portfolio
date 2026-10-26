import type { FC } from "react";

export const DraftBadge: FC = () => {
  return (
    <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 align-middle text-xs font-normal text-muted">
      Draft
    </span>
  );
};
