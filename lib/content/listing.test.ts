import { afterEach, describe, expect, it, vi } from "vitest";

// `isVisible` reads NODE_ENV when the module loads, so each test stubs the
// environment first and then imports a fresh copy of the module.
const loadListing = async (nodeEnv: string) => {
  vi.stubEnv("NODE_ENV", nodeEnv);
  vi.resetModules();
  return import("./listing");
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isVisible", () => {
  it("hides drafts in production", async () => {
    const { isVisible } = await loadListing("production");
    expect(isVisible({ draft: true })).toBe(false);
    expect(isVisible({ draft: false })).toBe(true);
    expect(isVisible({})).toBe(true);
  });

  it("shows drafts in development", async () => {
    const { isVisible } = await loadListing("development");
    expect(isVisible({ draft: true })).toBe(true);
  });
});
