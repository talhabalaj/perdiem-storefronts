"use client";

import Link from "next/link";
import { StoreNotFound } from "@/components/platform/StoreNotFound";
import { useOptionalStore } from "@/components/storefront/StoreContext";

/** Unknown path: themed 404 inside a known store, platform 404 when the store itself is unknown. */
export default function TenantNotFound() {
  const store = useOptionalStore();
  if (!store) return <StoreNotFound />;
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-5 px-4">
      <p className="font-heading text-2xl">{store.name}</p>
      <h1 className="font-heading text-5xl leading-none text-balance sm:text-6xl">
        That page isn&apos;t on the menu
      </h1>
      <p className="text-lg text-muted-foreground">
        The link may be old. Everything we serve is on the menu.
      </p>
      <Link
        href={store.basePath || "/"}
        className="press rounded-control bg-primary px-5 py-3 font-semibold text-primary-foreground"
      >
        See the menu
      </Link>
    </main>
  );
}
