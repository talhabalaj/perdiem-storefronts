import { beforeEach, describe, expect, it } from "vite-plus/test";
import { openDatabase } from "@/db/client";
import { SqliteStoreRepository } from "@/lib/repo/sqlite";

let repo: SqliteStoreRepository;

beforeEach(() => {
  repo = new SqliteStoreRepository(openDatabase(":memory:"));
});

const storeOrThrow = async (slug: string) => {
  const store = await repo.findStoreBySlug(slug);
  if (!store) throw new Error(`seed store ${slug} missing`);
  return store;
};

describe("SqliteStoreRepository", () => {
  it("seeds every store with its own branding", async () => {
    const stores = await repo.listStores();
    expect(stores.map((s) => s.slug).toSorted()).toEqual(["green-bowl", "luna", "smokestack"]);
    expect(new Set(stores.map((s) => s.theme.colors.primary)).size).toBe(3);
  });

  it("resolves custom domains to their store", async () => {
    expect((await repo.findStoreByDomain("order.lunacafe.test"))?.slug).toBe("luna");
    expect(await repo.findStoreByDomain("nope.test")).toBeNull();
  });

  it("returns only the requested store's menu", async () => {
    const luna = await storeOrThrow("luna");
    const smokestack = await storeOrThrow("smokestack");
    const lunaItems = (await repo.getMenu(luna.id)).flatMap((c) => c.items.map((i) => i.name));
    const bbqItems = (await repo.getMenu(smokestack.id)).flatMap((c) => c.items.map((i) => i.name));
    expect(lunaItems).toContain("Flat White");
    expect(lunaItems).not.toContain("Prime Brisket");
    expect(bbqItems).toContain("Prime Brisket");
  });

  it("refuses to update an item through another store's id", async () => {
    const luna = await storeOrThrow("luna");
    const smokestack = await storeOrThrow("smokestack");
    const brisket = (await repo.getMenu(smokestack.id))
      .flatMap((c) => c.items)
      .find((i) => i.name === "Prime Brisket");
    if (!brisket) throw new Error("brisket missing");

    expect(await repo.updateMenuItem(luna.id, brisket.id, { priceCents: 1 })).toBeNull();
    const updated = await repo.updateMenuItem(smokestack.id, brisket.id, { soldOut: true });
    expect(updated?.soldOut).toBe(true);
    expect(updated?.priceCents).toBe(1800);
  });

  it("validates theme updates", async () => {
    const luna = await storeOrThrow("luna");
    const theme = { ...luna.theme, colors: { ...luna.theme.colors, primary: "red" } };
    await expect(repo.updateTheme(luna.id, theme)).rejects.toThrow(/hex color/);
    const saved = await repo.updateTheme(luna.id, { ...luna.theme, layout: "board" });
    expect(saved?.theme.layout).toBe("board");
  });
});
