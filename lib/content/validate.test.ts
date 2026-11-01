import { describe, expect, it } from "vitest";
import { validatePostMetadata, validateProjectMetadata } from "./validate";

const post = {
  title: "Hello",
  description: "A post",
  date: "2026-10-26",
  tags: ["nextjs"],
};

const project = {
  title: "Site",
  summary: "A project",
  status: "building" as const,
  date: "2026-10-26",
  stack: ["Next.js"],
};

describe("validatePostMetadata", () => {
  it("returns valid metadata", () => {
    expect(validatePostMetadata("hello", { ...post, draft: true })).toEqual({
      ...post,
      draft: true,
    });
  });

  it.each(["title", "description", "date", "tags"] as const)(
    "throws with the file path when %s is missing",
    (field) => {
      const metadata = { ...post, [field]: undefined };
      expect(() => validatePostMetadata("hello", metadata)).toThrow(
        "content/log/hello.mdx",
      );
    },
  );

  it("throws when metadata is missing entirely", () => {
    expect(() => validatePostMetadata("hello", undefined)).toThrow(
      "metadata needs",
    );
  });

  it("rejects dates that aren't YYYY-MM-DD", () => {
    expect(() =>
      validatePostMetadata("hello", { ...post, date: "Oct 26, 2026" }),
    ).toThrow("date must be YYYY-MM-DD");
  });
});

describe("validateProjectMetadata", () => {
  it("returns valid metadata, including optional fields", () => {
    const full = {
      ...project,
      links: { repo: "https://github.com/x/y" },
      featured: true,
    };
    expect(validateProjectMetadata("site", full)).toEqual(full);
  });

  it.each(["title", "summary", "status", "date", "stack"] as const)(
    "throws with the file path when %s is missing",
    (field) => {
      const metadata = { ...project, [field]: undefined };
      expect(() => validateProjectMetadata("site", metadata)).toThrow(
        "content/projects/site.mdx",
      );
    },
  );

  it("rejects an unknown status", () => {
    const metadata = { ...project, status: "done" } as unknown as Parameters<
      typeof validateProjectMetadata
    >[1];
    expect(() => validateProjectMetadata("site", metadata)).toThrow(
      "status must be one of building, shipped",
    );
  });

  it("rejects dates that aren't YYYY-MM-DD", () => {
    expect(() =>
      validateProjectMetadata("site", { ...project, date: "2026-1-5" }),
    ).toThrow("date must be YYYY-MM-DD");
  });
});
