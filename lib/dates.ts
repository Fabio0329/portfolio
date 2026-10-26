// "2026-10-26" alone parses as midnight UTC, which is still Oct 25 in the
// Americas. Parsing and formatting in UTC keeps the date as written.
/** Formats a YYYY-MM-DD date like "Oct 26, 2026". */
export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
