import type { Category, MenuItem, MenuItemPatch, Store, StoreSummary, Theme } from "@/lib/schemas";
import type { NewMenuItem } from "@/lib/new-store";

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
  /** Throws StoreConflictError when the slug or custom domain is already taken. */
  createStore(record: NewStoreRecord): Promise<Store>;
  /** Adds a dish to the named section of this store's menu, creating the section if needed. */
  addMenuItem(storeId: number, item: NewMenuItem): Promise<MenuItem>;
}

export type NewStoreRecord = Omit<Store, "id"> & { customDomain: string | null };

export class StoreConflictError extends Error {
  constructor(readonly field: "slug" | "customDomain") {
    super(
      field === "slug" ? "That address is already taken" : "That domain already belongs to a store",
    );
  }
}
