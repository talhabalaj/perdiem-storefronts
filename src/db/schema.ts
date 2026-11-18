import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Hours, Seo, Theme } from "@/lib/schemas";

export const stores = sqliteTable("stores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  timezone: text("timezone").notNull(),
  currency: text("currency").notNull(),
  locale: text("locale").notNull(),
  // Branding, hours and SEO are read and written as whole documents, so JSON columns
  // (validated by zod at the repository boundary) beat a table per field here.
  theme: text("theme", { mode: "json" }).$type<Theme>().notNull(),
  hours: text("hours", { mode: "json" }).$type<Hours>().notNull(),
  seo: text("seo", { mode: "json" }).$type<Seo>().notNull(),
});

export const storeDomains = sqliteTable("store_domains", {
  hostname: text("hostname").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
});

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: integer("position").notNull(),
  },
  (t) => [index("categories_store_idx").on(t.storeId)],
);

export const menuItems = sqliteTable(
  "menu_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    priceCents: integer("price_cents").notNull(),
    unit: text("unit"),
    imageUrl: text("image_url"),
    soldOut: integer("sold_out", { mode: "boolean" }).notNull().default(false),
    position: integer("position").notNull(),
  },
  (t) => [index("menu_items_store_idx").on(t.storeId)],
);
