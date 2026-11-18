"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMenuItemAction } from "@/app/(platform)/admin/actions";
import { adminStoreKey, unwrap } from "@/lib/query/admin";
import type { AdminStore } from "@/lib/query/admin";
import type { MenuItemPatch } from "@/lib/schemas";

/** Optimistic item update: the UI changes at once and rolls back if the server rejects it. */
export function useUpdateItem(slug: string, itemId: number) {
  const queryClient = useQueryClient();
  const key = adminStoreKey(slug);
  const applyPatch = (patch: MenuItemPatch) => (old: AdminStore | undefined) =>
    old && {
      ...old,
      menu: old.menu.map((c) => ({
        ...c,
        items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
      })),
    };

  return useMutation({
    mutationFn: (patch: MenuItemPatch) => unwrap(updateMenuItemAction(slug, itemId, patch)),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<AdminStore>(key);
      queryClient.setQueryData<AdminStore>(key, applyPatch(patch));
      return { previous };
    },
    onError: (_error, _patch, context) => queryClient.setQueryData(key, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
