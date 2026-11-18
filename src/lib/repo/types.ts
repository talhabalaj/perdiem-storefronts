import type { Category, MenuItem, MenuItemPatch, Store, StoreSummary, Theme } from "@/lib/schemas";

/**
 * Storage boundary for everything tenant-related. Every method that touches tenant data
 * takes the owning storeId, so a caller can never read or write across stores by id alone.
 * Async on purpose: the SQLite implementation is sync, a Postgres one would not be.
 */
export interface StoreRepository {
  listStores(): Promise<StoreSummary[]>;
  findStoreBySlug(slug: string): Promise<Store | null>;
  findStoreByDomain(hostname: string): Promise<Store | null>;
  getMenu(storeId: number): Promise<Category[]>;
  updateTheme(storeId: number, theme: Theme): Promise<Store | null>;
  updateMenuItem(storeId: number, itemId: number, patch: MenuItemPatch): Promise<MenuItem | null>;
}
