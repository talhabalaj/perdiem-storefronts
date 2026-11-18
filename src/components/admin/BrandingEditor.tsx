"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { updateThemeAction } from "@/app/(platform)/admin/actions";
import { StorePreview } from "@/components/theme/StorePreview";
import { formatMoney } from "@/lib/money";
import { adminStoreKey, unwrap } from "@/lib/query/admin";
import type { AdminStore } from "@/lib/query/admin";
import type { Theme } from "@/lib/schemas";
import { ColorFields, HeroField, LayoutFields, TypeFields } from "./BrandingFields";
import { useAdminStore } from "./useAdminStore";

export function BrandingEditor() {
  const { slug, store, menu } = useAdminStore();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Theme>(store.theme);
  const save = useMutation({
    mutationFn: (theme: Theme) => unwrap(updateThemeAction(slug, theme)),
    onSuccess: (updated) => {
      queryClient.setQueryData<AdminStore>(
        adminStoreKey(slug),
        (old) => old && { ...old, store: updated },
      );
      setDraft(updated.theme);
    },
  });
  const dirty = JSON.stringify(draft) !== JSON.stringify(store.theme);
  const previewItems = menu
    .flatMap((category) => category.items)
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      price: formatMoney(item.priceCents, store.currency, store.locale),
      imageUrl: item.imageUrl,
    }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate(draft);
      }}
      className="grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="space-y-6">
        <ColorFields draft={draft} onChange={setDraft} />
        <TypeFields draft={draft} onChange={setDraft} />
        <LayoutFields draft={draft} onChange={setDraft} />
        <HeroField draft={draft} onChange={setDraft} />
      </div>
      <aside className="order-first space-y-2 lg:sticky lg:top-6 lg:order-none lg:self-start">
        <p className="text-xs font-medium text-muted-foreground">Live preview</p>
        <StorePreview theme={draft} name={store.name} items={previewItems} />
      </aside>
      <SaveBar
        dirty={dirty}
        saving={save.isPending}
        saved={save.isSuccess && !dirty}
        error={save.isError ? save.error.message : null}
        onReset={() => setDraft(store.theme)}
      />
    </form>
  );
}

function SaveBar({
  dirty,
  saving,
  saved,
  error,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  onReset: () => void;
}) {
  if (!dirty && !saved && !error) return null;
  return (
    <div className="order-bar fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:left-[15.5rem]">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-card border border-foreground/10 bg-background px-4 py-3 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)]">
        <output className="flex-1 text-sm">
          {error ?? null}
          {!error && dirty ? "Unsaved changes" : null}
          {!error && saved ? (
            <span className="inline-flex items-center gap-1.5">
              <Check aria-hidden className="size-4" /> Saved. The storefront is updated.
            </span>
          ) : null}
        </output>
        {dirty ? (
          <>
            <button
              type="button"
              onClick={onReset}
              className="press h-9 rounded-control px-3 text-sm font-medium hover:bg-muted"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="press h-9 rounded-control bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save branding"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
