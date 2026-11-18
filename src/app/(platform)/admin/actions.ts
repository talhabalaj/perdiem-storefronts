"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { cacheTags } from "@/lib/cache-tags";
import type { ActionResult } from "@/lib/query/admin";
import { NewMenuItemSchema, NewStoreSchema } from "@/lib/new-store";
import { isPlatformDomain, toNewStoreRecord } from "@/lib/new-store-record";
import { getRepository } from "@/lib/repo";
import { StoreConflictError } from "@/lib/repo/types";
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

export async function createStoreAction(input: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    const data = NewStoreSchema.parse(input);
    const rootDomain = process.env.ROOT_DOMAIN ?? "localhost";
    if (data.customDomain !== null && isPlatformDomain(data.customDomain, rootDomain)) {
      return {
        ok: false,
        error: `Use a domain outside ${rootDomain}; the store already gets ${data.slug}.${rootDomain}.`,
      };
    }
    const store = await getRepository().createStore(toNewStoreRecord(data));
    // Lookups for this slug or domain may have cached "no such store"; clear them so it's live now.
    updateTag(cacheTags.stores);
    updateTag(cacheTags.store(store.slug));
    updateTag(cacheTags.menu(store.slug));
    return { ok: true, data: { slug: store.slug } };
  } catch (error) {
    if (error instanceof StoreConflictError) return { ok: false, error: error.message };
    return fail(error);
  }
}

export async function addMenuItemAction(
  slug: string,
  input: unknown,
): Promise<ActionResult<MenuItem>> {
  try {
    const repo = getRepository();
    const store = await repo.findStoreBySlug(z.string().parse(slug));
    if (!store) return { ok: false, error: "Store not found" };
    const item = await repo.addMenuItem(store.id, NewMenuItemSchema.parse(input));
    updateTag(cacheTags.menu(slug));
    return { ok: true, data: item };
  } catch (error) {
    return fail(error);
  }
}
