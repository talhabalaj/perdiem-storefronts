"use client";

import { LayoutGrid, ShieldAlert, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavStore {
  slug: string;
  name: string;
  color: string;
}

/** Desktop: a fixed sidebar. Phone: a top bar with the stores as a swipeable strip. */
export function SidebarNav({ stores }: { stores: NavStore[] }) {
  const pathname = usePathname();
  const activeSlug = pathname.split("/")[2];
  const item =
    "press flex items-center gap-2.5 rounded-control px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current]:bg-muted aria-[current]:text-foreground";

  return (
    <aside className="sticky top-0 z-20 border-b border-foreground/10 bg-background lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex h-14 items-center gap-2 px-4 lg:px-5">
        <span className="grid size-7 place-items-center rounded-control bg-foreground text-background">
          <Store aria-hidden className="size-4" />
        </span>
        <span className="font-semibold">Storefront admin</span>
      </div>
      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:overflow-visible lg:pt-2"
      >
        <Link
          href="/admin"
          aria-current={pathname === "/admin" ? "page" : undefined}
          className={`${item} shrink-0`}
        >
          <LayoutGrid aria-hidden className="size-4" /> All stores
        </Link>
        <p className="hidden px-2.5 pt-5 pb-1 text-xs font-medium text-muted-foreground lg:block">
          Stores
        </p>
        {stores.map((store) => (
          <Link
            key={store.slug}
            href={`/admin/${store.slug}`}
            aria-current={store.slug === activeSlug ? "page" : undefined}
            className={`${item} shrink-0`}
          >
            <span
              aria-hidden
              className="size-3 rounded-full ring-1 ring-foreground/15"
              style={{ backgroundColor: store.color }}
            />
            {store.name}
          </Link>
        ))}
      </nav>
      <div className="hidden border-t border-foreground/10 p-4 text-xs text-muted-foreground lg:block">
        <p className="flex gap-2">
          <ShieldAlert aria-hidden className="size-4 shrink-0" />
          No sign-in in this demo: anyone who can reach this host can edit stores.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block underline underline-offset-2 hover:text-foreground"
        >
          Back to the store directory
        </Link>
      </div>
    </aside>
  );
}
