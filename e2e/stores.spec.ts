import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const PORT = 3211;
const store = (host: string, path = "/") => `http://${host}:${PORT}${path}`;

const primaryColor = (page: Page) =>
  page
    .locator("[data-store]")
    .first()
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--primary").trim());

test("each subdomain renders its own store, data and branding", async ({ page }) => {
  await page.goto(store("luna.localhost"));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Luna Café");
  await expect(page.getByText("Flat White")).toBeVisible();
  expect(await primaryColor(page)).toBe("#2f3c8f");

  await page.goto(store("smokestack.localhost"));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Smokestack BBQ");
  await expect(page.getByText("Prime Brisket")).toBeVisible();
  await expect(page.getByText("per ½ lb").filter({ visible: true })).toBeVisible();
  await expect(page.getByText("Flat White")).toHaveCount(0);
  expect(await primaryColor(page)).toBe("#8a2d1a");
});

test("per-store metadata: title, theme color and favicon", async ({ page }) => {
  await page.goto(store("smokestack.localhost"));
  await expect(page).toHaveTitle(/Smokestack BBQ/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#8a2d1a");
  const icon = await page.request.get(store("smokestack.localhost", "/brand-icon"));
  expect(await icon.text()).toContain('fill="#8a2d1a"');
});

test("the menu is in the server-rendered HTML, not only rendered by JS", async ({ request }) => {
  const html = await (await request.get(store("smokestack.localhost"))).text();
  expect(html).toContain("<h3");
  expect(html).toContain("Prime Brisket");
  expect(html).toContain("$18.00");
});

test("a custom domain resolves to its store", async ({ page }) => {
  await page.goto(store("order.lunacafe.test"));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Luna Café");
});

test("path routing works on the platform host, with the store's currency", async ({ page }) => {
  await page.goto("/s/green-bowl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Green Bowl");
  await expect(page.getByText("£10.95")).toBeVisible();
});

test("unknown stores get the platform 404, never another tenant", async ({ page }) => {
  await page.goto(store("nope.localhost"));
  await expect(
    page.getByRole("heading", { name: "There's no store at this address" }),
  ).toBeVisible();
  // "Home" on an unknown host must leave that host, or it would loop back to this page.
  await expect(page.getByRole("link", { name: "Browse stores" })).toHaveAttribute(
    "href",
    `http://localhost:${PORT}/`,
  );
  await page.goto("/s/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "There's no store at this address" }),
  ).toBeVisible();
  const internal = await page.request.get("/t/sub~luna");
  expect(internal.status()).toBe(404);
});

test("an unknown path inside a known store gets that store's themed 404", async ({ page }) => {
  await page.goto(store("luna.localhost", "/not-a-page"));
  await expect(page.getByRole("heading", { name: "That page isn't on the menu" })).toBeVisible();
  expect(await primaryColor(page)).toBe("#2f3c8f");
});

test("carts are isolated per store, even on a shared origin", async ({ page }) => {
  await page.goto("/s/luna");
  await page.getByRole("button", { name: "Add Butter Croissant to order" }).click();
  await expect(page.getByRole("button", { name: "Your order, 1 item" })).toBeVisible();

  await page.goto("/s/green-bowl");
  await expect(page.getByRole("button", { name: "Your order, 0 items" })).toBeVisible();

  await page.goto("/s/luna");
  await expect(page.getByRole("button", { name: "Your order, 1 item" })).toBeVisible();
});

test("an admin edit shows up on that store's storefront", async ({ page }) => {
  await page.goto("/admin/green-bowl/menu");
  const price = page.getByLabel("Watermelon & Feta price");
  await price.fill("9.45");
  const row = page.getByRole("row").filter({ has: price });
  await row.getByRole("button", { name: "Save" }).click();
  // Save only shows while a row has unsaved edits, so it disappears once the save lands.
  await expect(row.getByRole("button", { name: "Save" })).toHaveCount(0);

  // The very first request after the save must already be fresh (read-your-writes), and in HTML.
  const html = await (await page.request.get(store("green-bowl.localhost"))).text();
  expect(html).toContain("£9.45");
  expect(html).not.toContain("£8.95");

  await page.goto(store("green-bowl.localhost"));
  await expect(page.getByText("£9.45")).toBeVisible();
});

test("keyboard: after Add, focus moves to the new stepper", async ({ page }) => {
  await page.goto(store("luna.localhost"));
  await page.getByRole("button", { name: "Add Flat White to order" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "One more Flat White" })).toBeFocused();
  await expect(page.locator("output").filter({ hasText: "Added Flat White" })).toBeAttached();
});

test("admin branding survives a half-typed logo URL", async ({ page }) => {
  await page.goto("/admin/luna/branding");
  const logo = page.getByLabel("Logo", { exact: true });
  await logo.fill("h");
  await expect(page.getByText("Enter a full URL, or a path starting with /")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Colors" })).toBeVisible();
});

test("clearing an order can be undone", async ({ page }) => {
  await page.goto("/s/smokestack");
  await page.getByRole("button", { name: "Add Prime Brisket to order" }).click();
  await page.getByRole("button", { name: /^Your order/ }).click();
  await expect(page.getByText("1 × ½ lb, $18.00")).toBeVisible();
  await page.getByRole("button", { name: "Clear order" }).click();
  await expect(page.getByRole("button", { name: "Undo" })).toBeFocused();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("button", { name: "Close order" })).toBeFocused();
  await expect(page.getByText("1 × ½ lb, $18.00")).toBeVisible();
});
