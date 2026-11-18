import { HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { Suspense } from "react";
import { StoreNotFound } from "@/components/platform/StoreNotFound";
import { BoardStorefront } from "@/components/storefront/layouts/BoardStorefront";
import { ClassicStorefront } from "@/components/storefront/layouts/ClassicStorefront";
import { GalleryStorefront } from "@/components/storefront/layouts/GalleryStorefront";
import { getMenuHydrationState } from "@/lib/data";
import { resolveTenant } from "@/lib/tenant/resolve";

const LAYOUTS = { classic: ClassicStorefront, board: BoardStorefront, gallery: GalleryStorefront };

// Not async: params are read inside the boundary so the route keeps a static shell.
export default function StorePage({ params }: PageProps<"/t/[tenantKey]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-6xl animate-pulse bg-muted" />}>
      <StoreContent params={params} />
    </Suspense>
  );
}

async function StoreContent({ params }: Pick<PageProps<"/t/[tenantKey]">, "params">) {
  // Rendered per request on top of tag-cached reads, so an admin edit is visible on the very
  // next request and the HTML always contains the full menu. See README "Caching".
  await connection();
  const tenant = await resolveTenant((await params).tenantKey);
  if (!tenant) return <StoreNotFound />;
  const { store, basePath } = tenant;
  const Layout = LAYOUTS[store.theme.layout];

  // The client starts with the server-read menu in its React Query cache: no loading spinner.
  return (
    <HydrationBoundary state={await getMenuHydrationState(store.id, store.slug)}>
      <Layout store={store} basePath={basePath} />
    </HydrationBoundary>
  );
}
