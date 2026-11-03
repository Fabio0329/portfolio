import { expect, test } from "@playwright/test";
import { site } from "@/lib/site";

test("the site name stays on one line", async ({ page }) => {
  await page.goto("/");
  const name = page.getByRole("banner").getByRole("link", { name: site.name });

  const lines = await name.evaluate((element) => {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    return Math.round(element.getBoundingClientRect().height / lineHeight);
  });
  expect(lines).toBe(1);
});

test("every nav link and the theme toggle stay on screen", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const nav = page.getByRole("navigation", { name: "Main" });

  for (const control of [
    ...(await nav.getByRole("link").all()),
    nav.getByRole("button", { name: "Toggle dark mode" }),
  ]) {
    const box = (await control.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
});
