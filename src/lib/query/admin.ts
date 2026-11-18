import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { CategorySchema, StoreSchema } from "@/lib/schemas";

export const adminStoreKey = (slug: string) => ["admin", "store", slug] as const;

export const AdminStoreSchema = z.object({ store: StoreSchema, menu: z.array(CategorySchema) });
export type AdminStore = z.infer<typeof AdminStoreSchema>;

export const adminStoreQuery = (slug: string) =>
  queryOptions({
    queryKey: adminStoreKey(slug),
    queryFn: async (): Promise<AdminStore> => {
      const res = await fetch(`/api/admin/stores/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Admin request failed (${res.status})`);
      return AdminStoreSchema.parse(await res.json());
    },
  });

/** Server actions return results instead of throwing, so messages survive production builds. */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function unwrap<T>(result: Promise<ActionResult<T>>): Promise<T> {
  const settled = await result;
  if (!settled.ok) throw new Error(settled.error);
  return settled.data;
}
