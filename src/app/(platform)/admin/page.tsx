import { Plus } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { StoresTable } from "@/components/admin/StoresTable";
import type { StoreRow } from "@/components/admin/StoresTable";
import { getRepository } from "@/lib/repo";

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All stores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every storefront this platform serves. Pick one to change its branding or menu.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="press inline-flex h-10 items-center gap-2 rounded-control bg-foreground px-4 text-sm font-semibold text-background"
        >
          <Plus aria-hidden className="size-4" /> New store
        </Link>
      </div>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-card bg-muted" />}>
        <StoresOverview />
      </Suspense>
    </main>
  );
}

async function StoresOverview() {
  // Admin always reads live data, not the storefront cache.
  await connection();
  const repo = getRepository();
  const stores = await repo.listStores();
  const rows: StoreRow[] = await Promise.all(
    stores.map(async (store) => {
      const items = (await repo.getMenu(store.id)).flatMap((category) => category.items);
      return {
        slug: store.slug,
        name: store.name,
        color: store.theme.colors.primary,
        layout: store.theme.layout,
        items: items.length,
        soldOut: items.filter((item) => item.soldOut).length,
        domains: store.customDomains,
      };
    }),
  );
  return <StoresTable rows={rows} />;
}
