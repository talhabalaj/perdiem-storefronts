"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";
import type { Store } from "@/lib/schemas";

export type StoreInfo = Pick<
  Store,
  "id" | "slug" | "name" | "currency" | "locale" | "timezone" | "hours"
> & { basePath: string };

const StoreContext = createContext<StoreInfo | null>(null);

export function StoreProvider({ store, children }: { store: StoreInfo; children: ReactNode }) {
  return <StoreContext value={store}>{children}</StoreContext>;
}

/** Null outside a known store (e.g. a 404 under an unknown host). */
export function useOptionalStore(): StoreInfo | null {
  return use(StoreContext);
}

export function useStore(): StoreInfo {
  const store = use(StoreContext);
  if (!store) throw new Error("useStore must be used inside <StoreProvider>");
  return store;
}
