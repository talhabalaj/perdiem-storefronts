import { getStoreByDomain, getStoreBySlug } from "@/lib/data";
import type { Store } from "@/lib/schemas";
import { parseTenantKey } from "./parse";

export interface Tenant {
  store: Store;
  /** Prefix for in-store links and API calls: "" on a store host, "/s/<slug>" in path mode. */
  basePath: string;
}

/** Turns the /t/<key> segment back into a store. Unknown or malformed keys resolve to null. */
export async function resolveTenant(rawKey: string): Promise<Tenant | null> {
  const key = parseTenantKey(rawKey);
  if (!key) return null;
  const store =
    key.mode === "dom" ? await getStoreByDomain(key.hostname) : await getStoreBySlug(key.slug);
  if (!store) return null;
  return { store, basePath: key.mode === "path" ? `/s/${store.slug}` : "" };
}
