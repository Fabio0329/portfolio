import { expect, test } from "@playwright/test";
import { presetTheme } from "./pages";

test("the skip link is the first tab stop and jumps to the content", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);

  // The next Tab continues from inside <main>, past the header.
  await page.keyboard.press("Tab");
  const focusedInMain = await page.evaluate(
    () => document.activeElement?.closest("main") !== null,
  );
  expect(focusedInMain).toBe(true);
});

test("the theme toggle works from the keyboard", async ({ page }) => {
  await presetTheme(page, "light");
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Toggle dark mode" });
  await toggle.focus();
  await expect(toggle).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("keyboard focus is visible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const outline = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as Element);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThan(0);
});
