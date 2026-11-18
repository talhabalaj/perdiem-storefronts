import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { StoreTabs } from "@/components/admin/StoreTabs";
import { adminStoreKey } from "@/lib/query/admin";
import type { AdminStore } from "@/lib/query/admin";
import { getRepository } from "@/lib/repo";
import { storeUrls } from "@/lib/store-urls";

export default function StoreAdminLayout({ children, params }: LayoutProps<"/admin/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto mt-10 h-96 max-w-6xl animate-pulse rounded-card bg-muted" />
      }
    >
      <StoreAdminFrame params={params}>{children}</StoreAdminFrame>
    </Suspense>
  );
}

async function StoreAdminFrame({ children, params }: LayoutProps<"/admin/[slug]">) {
  // Editors need the live database state, not the storefront cache: render per request.
  await connection();
  const { slug } = await params;
  const repo = getRepository();
  const [store, summary] = await Promise.all([
    repo.findStoreBySlug(slug),
    repo.listStores().then((all) => all.find((s) => s.slug === slug)),
  ]);
  if (!store || !summary) notFound();

  const queryClient = new QueryClient();
  const initial: AdminStore = { store, menu: await repo.getMenu(store.id) };
  queryClient.setQueryData(adminStoreKey(slug), initial);
  const requestHeaders = await headers();
  const links = storeUrls(summary, {
    host: requestHeaders.get("host"),
    proto: requestHeaders.get("x-forwarded-proto"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="border-b border-foreground/10">
        <div className="mx-auto max-w-6xl px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{store.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{store.tagline}</p>
            </div>
            <a
              href={links[0]?.href}
              target="_blank"
              rel="noreferrer"
              className="press inline-flex h-9 items-center gap-2 rounded-control border border-foreground/15 px-3 text-sm font-medium hover:bg-muted"
            >
              Open storefront <ExternalLink aria-hidden className="size-4" />
            </a>
          </div>
          <StoreTabs slug={slug} />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
    </HydrationBoundary>
  );
}
