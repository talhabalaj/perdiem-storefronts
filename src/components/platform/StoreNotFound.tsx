"use client";

import { usePlatformHome } from "./PlatformHome";

/** Shown when a host, domain or /s/<slug> matches no store. Never falls back to another tenant. */
export function StoreNotFound() {
  const home = usePlatformHome();
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-5 px-4">
      <meta name="robots" content="noindex" />
      <h1 className="font-heading text-4xl font-semibold text-balance sm:text-5xl">
        There&apos;s no store at this address
      </h1>
      <p className="text-lg text-muted-foreground">
        Check the link you followed, or pick a store from the directory.
      </p>
      {/* A plain link: the directory can live on a different host than this page. */}
      <a
        href={home}
        className="press rounded-control bg-primary px-5 py-3 font-semibold text-primary-foreground"
      >
        Browse stores
      </a>
    </main>
  );
}
