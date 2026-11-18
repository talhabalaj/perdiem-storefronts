import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { CategorySchema } from "@/lib/schemas";
import type { Category } from "@/lib/schemas";

export const menuKey = (slug: string) => ["menu", slug] as const;

const MenuResponse = z.array(CategorySchema);

async function fetchMenu(basePath: string): Promise<Category[]> {
  const res = await fetch(`${basePath}/api/menu`);
  if (!res.ok) throw new Error(`Menu request failed (${res.status})`);
  return MenuResponse.parse(await res.json());
}

/**
 * The menu is server state: prefetched during SSR, then kept fresh on the client so sold-out
 * and price changes from the admin show up when the tab regains focus.
 */
export const menuQuery = (slug: string, basePath: string) =>
  queryOptions({
    queryKey: menuKey(slug),
    queryFn: () => fetchMenu(basePath),
    refetchOnWindowFocus: true,
  });
