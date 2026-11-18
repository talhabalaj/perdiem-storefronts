import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { storeDomains, stores } from "@/db/schema";
import type { TenantRoute } from "./parse";

/**
 * Does any store answer at this address? Used by the proxy so an unknown store gets a real
 * 404 status before streaming starts. One indexed lookup, read live so new stores count at once.
 */
export function storeExists(route: Exclude<TenantRoute, { kind: "platform" }>): boolean {
  const db = getDb();
  if (route.kind === "domain") {
    return (
      db
        .select({ hostname: storeDomains.hostname })
        .from(storeDomains)
        .where(eq(storeDomains.hostname, route.hostname))
        .get() !== undefined
    );
  }
  return (
    db.select({ id: stores.id }).from(stores).where(eq(stores.slug, route.slug)).get() !== undefined
  );
}
