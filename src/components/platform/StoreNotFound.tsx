"use client";

import { useSyncExternalStore } from "react";

// The location never changes while this page is open, so there is nothing to subscribe to.
const unsubscribe = () => undefined;
const subscribe = () => unsubscribe;

/** On an unknown host, "/" is that same host, so the way home is the platform's own origin. */
function platformHome(): string {
  const { protocol, port } = window.location;
  return `${protocol}//${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost"}${port ? `:${port}` : ""}/`;
}

/** Shown when a host, domain or /s/<slug> matches no store. Never falls back to another tenant. */
export function StoreNotFound() {
  const home = useSyncExternalStore(subscribe, platformHome, () => "/");
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
