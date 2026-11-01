import { describe, expect, it } from "vitest";
import { escapeXml } from "./xml";

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    expect(escapeXml(`Tom & "Jerry" <it's>`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;it&apos;s&gt;",
    );
  });

  // & must be replaced before the others, or "<" would end up as "&amp;lt;".
  it("doesn't double-escape", () => {
    expect(escapeXml("<")).toBe("&lt;");
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
  });

  it("leaves plain text alone", () => {
    expect(escapeXml("Next.js notes")).toBe("Next.js notes");
  });
});
