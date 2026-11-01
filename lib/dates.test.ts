import { describe, expect, it } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  it("formats a YYYY-MM-DD date", () => {
    expect(formatDate("2026-10-26")).toBe("Oct 26, 2026");
  });

  // Tests run in America/New_York (see vitest.config.mts), where a naive
  // `new Date("2026-01-01")` would show Dec 31, 2025.
  it("doesn't shift the day in time zones west of UTC", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });
});
