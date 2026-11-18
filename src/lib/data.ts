import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { menuKey } from "@/lib/query/menu";
import { getRepository } from "@/lib/repo";
import type { Category, Store, StoreSummary } from "@/lib/schemas";

// Cached, tagged reads. Admin mutations call updateTag() with the same tags, so only the
// store that changed is re-read.

export async function listStores(): Promise<StoreSummary[]> {
  "use cache";
  cacheTag(cacheTags.stores);
  return getRepository().listStores();
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  "use cache";
  cacheTag(cacheTags.store(slug));
  return getRepository().findStoreBySlug(slug);
}

export async function getStoreByDomain(hostname: string): Promise<Store | null> {
  "use cache";
  cacheTag(cacheTags.stores);
  const store = await getRepository().findStoreByDomain(hostname);
  if (store) cacheTag(cacheTags.store(store.slug));
  return store;
}

export async function getMenu(storeId: number, slug: string): Promise<Category[]> {
  "use cache";
  cacheTag(cacheTags.menu(slug));
  return getRepository().getMenu(storeId);
}

/**
 * React Query state for a store's menu, ready for <HydrationBoundary>. Built inside the cache
 * because setQueryData/dehydrate stamp Date.now(), which prerendering only allows here; the
 * tag means an admin edit refreshes the hydration payload together with the menu.
 */
export async function getMenuHydrationState(
  storeId: number,
  slug: string,
): Promise<DehydratedState> {
  "use cache";
  cacheTag(cacheTags.menu(slug));
  const queryClient = new QueryClient();
  queryClient.setQueryData(menuKey(slug), await getRepository().getMenu(storeId));
  return dehydrate(queryClient);
}
