import { and, asc, eq } from "drizzle-orm";
import type { Db } from "@/db/client";
import { categories, menuItems, storeDomains, stores } from "@/db/schema";
import { MenuItemPatchSchema, MenuItemSchema, StoreSchema, ThemeSchema } from "@/lib/schemas";
import type { Category, MenuItem, MenuItemPatch, Store, StoreSummary, Theme } from "@/lib/schemas";
import type { StoreRepository } from "./types";

type StoreRow = typeof stores.$inferSelect;
type ItemRow = typeof menuItems.$inferSelect;

// JSON columns are typed by Drizzle but not checked; parse at the boundary so a bad row
// surfaces here instead of as a broken theme in the browser.
const toStore = (row: StoreRow): Store => StoreSchema.parse(row);
const toMenuItem = ({
  id,
  name,
  description,
  priceCents,
  unit,
  imageUrl,
  soldOut,
}: ItemRow): MenuItem =>
  MenuItemSchema.parse({ id, name, description, priceCents, unit, imageUrl, soldOut });

export class SqliteStoreRepository implements StoreRepository {
  constructor(private readonly db: Db) {}

  async listStores(): Promise<StoreSummary[]> {
    const rows = await this.db.select().from(stores).orderBy(asc(stores.name));
    const domains = await this.db.select().from(storeDomains);
    return rows.map((row) => {
      const { id, slug, name, tagline, theme } = toStore(row);
      const customDomains = domains.filter((d) => d.storeId === id).map((d) => d.hostname);
      return { id, slug, name, tagline, theme, customDomains };
    });
  }

  async findStoreBySlug(slug: string): Promise<Store | null> {
    const [row] = await this.db.select().from(stores).where(eq(stores.slug, slug)).limit(1);
    return row ? toStore(row) : null;
  }

  async findStoreByDomain(hostname: string): Promise<Store | null> {
    const [row] = await this.db
      .select({ store: stores })
      .from(storeDomains)
      .innerJoin(stores, eq(storeDomains.storeId, stores.id))
      .where(eq(storeDomains.hostname, hostname))
      .limit(1);
    return row ? toStore(row.store) : null;
  }

  async getMenu(storeId: number): Promise<Category[]> {
    const cats = await this.db
      .select()
      .from(categories)
      .where(eq(categories.storeId, storeId))
      .orderBy(asc(categories.position));
    const items = await this.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.storeId, storeId))
      .orderBy(asc(menuItems.position));
    return cats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: items.filter((item) => item.categoryId === cat.id).map(toMenuItem),
    }));
  }

  async updateTheme(storeId: number, theme: Theme): Promise<Store | null> {
    const [row] = await this.db
      .update(stores)
      .set({ theme: ThemeSchema.parse(theme) })
      .where(eq(stores.id, storeId))
      .returning();
    return row ? toStore(row) : null;
  }

  async updateMenuItem(
    storeId: number,
    itemId: number,
    patch: MenuItemPatch,
  ): Promise<MenuItem | null> {
    const [row] = await this.db
      .update(menuItems)
      .set(MenuItemPatchSchema.parse(patch))
      // Scoping by storeId too means a forged itemId from another store matches nothing.
      .where(and(eq(menuItems.id, itemId), eq(menuItems.storeId, storeId)))
      .returning();
    return row ? toMenuItem(row) : null;
  }
}
