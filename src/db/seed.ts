import { z } from "zod";
import { SeedStoreSchema } from "@/lib/schemas";
import type { SeedStore } from "@/lib/schemas";
import greenBowl from "./seed/green-bowl.json";
import luna from "./seed/luna.json";
import smokestack from "./seed/smokestack.json";
import { categories, menuItems, storeDomains, stores } from "./schema";
import type { Db } from "./client";

/** Validated at load so a bad seed file fails loudly with a field path, not at render time. */
export const SEED_STORES: SeedStore[] = z
  .array(SeedStoreSchema)
  .parse([luna, smokestack, greenBowl]);

export function seedDatabase(db: Db, seeds: SeedStore[]): void {
  db.transaction((tx) => {
    for (const { customDomains, menu, ...store } of seeds) {
      const { id: storeId } = tx.insert(stores).values(store).returning({ id: stores.id }).get();
      for (const hostname of customDomains) {
        tx.insert(storeDomains).values({ hostname, storeId }).run();
      }
      menu.forEach((category, categoryPosition) => {
        const { id: categoryId } = tx
          .insert(categories)
          .values({ storeId, name: category.name, position: categoryPosition })
          .returning({ id: categories.id })
          .get();
        category.items.forEach((item, position) => {
          tx.insert(menuItems)
            .values({ ...item, storeId, categoryId, position })
            .run();
        });
      });
    }
  });
}
