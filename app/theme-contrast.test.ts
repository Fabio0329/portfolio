import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ogColors } from "@/lib/og";

// Guards the design tokens in globals.css: every text color must meet WCAG AA
// (4.5:1) on every background it's used on, in both themes.

const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

type Tokens = Record<string, string>;

const readTokens = (selector: string): Tokens => {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No "${selector}" block in globals.css`);
  const block = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(
      ([, name, hex]) => [name, hex.toLowerCase()],
    ),
  );
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const themes = {
  light: readTokens(":root"),
  dark: readTokens(':root[data-theme="dark"]'),
};

// [text, background] pairs the site actually uses.
const pairs = [
  ["foreground", "background"],
  ["muted", "background"],
  ["accent", "background"],
  ["foreground", "surface"],
  ["muted", "surface"],
  ["background", "foreground"], // the Resume button
] as const;

describe.each(Object.entries(themes))("%s theme", (_, tokens) => {
  it.each(pairs)("%s on %s meets 4.5:1", (text, background) => {
    expect(contrast(tokens[text], tokens[background])).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});

describe("token blocks stay in sync", () => {
  it("the no-JS dark fallback matches the dark theme", () => {
    expect(readTokens(":root:not([data-theme])")).toEqual(themes.dark);
  });

  it("the OG image colors match the light theme", () => {
    for (const [name, hex] of Object.entries(ogColors)) {
      expect(hex.toLowerCase(), name).toBe(themes.light[name]);
    }
  });
});
