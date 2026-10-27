import type { FC } from "react";
import { formatDate } from "@/lib/dates";
import { site } from "@/lib/site";

// A dated "what I'm doing now" note. The date keeps it honest: update the
// items and `updated` in lib/site.ts together.
export const NowBlock: FC = () => {
  const { updated, items } = site.now;

  return (
    <section
      aria-labelledby="now"
      className="rounded-lg border border-border bg-surface p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="now" className="text-lg font-medium">
          Now
        </h2>
        <p className="text-sm text-muted">
          Updated <time dateTime={updated}>{formatDate(updated)}</time>
        </p>
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};
