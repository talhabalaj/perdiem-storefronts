import { headers } from "next/headers";
import { cache } from "react";
import type { PreviewItem } from "@/components/theme/StorePreview";
import { getMenu, getStoreBySlug, listStores } from "@/lib/data";
import { formatMoney } from "@/lib/money";
import type { StoreSummary } from "@/lib/schemas";
import { storeUrls } from "@/lib/store-urls";

export interface DirectoryStore {
  store: StoreSummary;
  links: { label: string; href: string }[];
  items: PreviewItem[];
}

/** Everything the platform page shows, read once per request (React cache) for both sections. */
export const loadDirectory = cache(async (): Promise<DirectoryStore[]> => {
  const [stores, requestHeaders] = await Promise.all([listStores(), headers()]);
  const request = {
    host: requestHeaders.get("host"),
    proto: requestHeaders.get("x-forwarded-proto"),
  };
  return Promise.all(
    stores.map(async (store) => ({
      store,
      links: storeUrls(store, request),
      items: await previewItems(store.slug),
    })),
  );
});

async function previewItems(slug: string): Promise<PreviewItem[]> {
  const store = await getStoreBySlug(slug);
  if (!store) return [];
  const menu = await getMenu(store.id, store.slug);
  return menu
    .flatMap((category) => category.items)
    .filter((item) => !item.soldOut)
    .slice(0, 6)
    .map((item) => ({
      name: item.name,
      price: formatMoney(item.priceCents, store.currency, store.locale),
      imageUrl: item.imageUrl,
    }));
}
