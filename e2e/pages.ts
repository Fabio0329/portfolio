import type { APIRequestContext, Page } from "@playwright/test";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export const themes: Theme[] = ["light", "dark"];

/**
 * Every page to check: the paths in the built sitemap (which includes drafts
 * in the test build), plus a missing page to cover the 404.
 */
export const getPagePaths = async (request: APIRequestContext) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => new URL(url).pathname,
  );
  return [...paths, "/this-page-does-not-exist"];
};

/** Make every page load in the given theme, before any page script runs. */
export const presetTheme = async (page: Page, theme: Theme) => {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    THEME_STORAGE_KEY,
    theme,
  ] as const);
};
