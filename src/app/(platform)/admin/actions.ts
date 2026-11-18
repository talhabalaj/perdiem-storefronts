"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { cacheTags } from "@/lib/cache-tags";
import type { ActionResult } from "@/lib/query/admin";
import { getRepository } from "@/lib/repo";
import { MenuItemPatchSchema, ThemeSchema } from "@/lib/schemas";
import type { MenuItem, Store } from "@/lib/schemas";

// Inputs arrive from the network, so they are `unknown` and parsed here, never trusted.

const fail = (error: unknown): { ok: false; error: string } => ({
  ok: false,
  error: error instanceof z.ZodError ? z.prettifyError(error) : "Something went wrong saving.",
});

export async function updateThemeAction(
  slug: string,
  input: unknown,
): Promise<ActionResult<Store>> {
  try {
    const repo = getRepository();
    const store = await repo.findStoreBySlug(z.string().parse(slug));
    if (!store) return { ok: false, error: "Store not found" };
    const updated = await repo.updateTheme(store.id, ThemeSchema.parse(input));
    if (!updated) return { ok: false, error: "Store not found" };
    // Only this store's pages (and the platform directory swatches) are re-rendered.
    updateTag(cacheTags.store(slug));
    updateTag(cacheTags.stores);
    return { ok: true, data: updated };
  } catch (error) {
    return fail(error);
  }
}

export async function updateMenuItemAction(
  slug: string,
  itemId: number,
  input: unknown,
): Promise<ActionResult<MenuItem>> {
  try {
    const repo = getRepository();
    const store = await repo.findStoreBySlug(z.string().parse(slug));
    if (!store) return { ok: false, error: "Store not found" };
    const id = z.number().int().positive().parse(itemId);
    const updated = await repo.updateMenuItem(store.id, id, MenuItemPatchSchema.parse(input));
    if (!updated) return { ok: false, error: "Item not found in this store" };
    updateTag(cacheTags.menu(slug));
    return { ok: true, data: updated };
  } catch (error) {
    return fail(error);
  }
}
