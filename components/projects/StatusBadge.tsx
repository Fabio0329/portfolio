import type { FC } from "react";
import type { ProjectStatus } from "@/lib/content/types";

type StatusBadgeProps = {
  status: ProjectStatus;
};

const labels: Record<ProjectStatus, string> = {
  building: "Building",
  shipped: "Shipped",
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${status === "building" ? "bg-accent" : "bg-muted"}`}
      />
      {labels[status]}
    </span>
  );
};
