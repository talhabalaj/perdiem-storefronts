import type { Metadata } from "next";
import { headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { PlatformHomeProvider } from "@/components/platform/PlatformHome";
import { StoreProvider } from "@/components/storefront/StoreContext";
import { platformUrl } from "@/lib/store-urls";
import { resolveTenant } from "@/lib/tenant/resolve";
import { themeToCssVars } from "@/lib/theme/css-vars";

export async function generateMetadata({
  params,
}: LayoutProps<"/t/[tenantKey]">): Promise<Metadata> {
  const tenant = await resolveTenant((await params).tenantKey);
  if (!tenant) return { title: "Store not found" };
  const { store, basePath } = tenant;
  return {
    title: store.seo.title,
    description: store.seo.description,
    icons: {
      icon: store.theme.logoUrl
        ? { url: store.theme.logoUrl, type: "image/png" }
        : { url: `${basePath}/brand-icon`, type: "image/svg+xml" },
    },
    openGraph: {
      title: store.seo.title,
      description: store.seo.description,
      siteName: store.name,
      locale: store.locale.replace("-", "_"),
      images: store.theme.heroImageUrl ? [store.theme.heroImageUrl] : [],
    },
  };
}

export default function TenantLayout({ children, params }: LayoutProps<"/t/[tenantKey]">) {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <TenantFrame params={params}>{children}</TenantFrame>
    </Suspense>
  );
}

async function TenantFrame({ children, params }: LayoutProps<"/t/[tenantKey]">) {
  // The store depends on the request host, so this tree renders per request (data stays cached).
  await connection();
  const tenant = await resolveTenant((await params).tenantKey);
  // Unknown store: no theme or store context. The page renders the platform 404 itself, so the
  // route still renders its request-time marker (calling notFound() here would skip the page).
  if (!tenant) {
    const requestHeaders = await headers();
    const home = platformUrl({
      host: requestHeaders.get("host"),
      proto: requestHeaders.get("x-forwarded-proto"),
    });
    return <PlatformHomeProvider href={home}>{children}</PlatformHomeProvider>;
  }
  const { store, basePath } = tenant;
  const { id, slug, name, currency, locale, timezone, hours } = store;

  return (
    <StoreProvider store={{ id, slug, name, currency, locale, timezone, hours, basePath }}>
      <meta name="theme-color" content={store.theme.colors.primary} />
      <div
        data-store={slug}
        lang={locale}
        style={themeToCssVars(store.theme)}
        className="min-h-dvh bg-background font-body text-foreground"
      >
        {children}
      </div>
    </StoreProvider>
  );
}

/** Tenant-agnostic shell: it is shared by every unknown store, so it carries no branding. */
function StoreSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6" aria-busy>
      <div className="h-8 w-48 rounded-control bg-muted" />
      <div className="mt-6 h-72 rounded-card bg-muted" />
    </div>
  );
}
