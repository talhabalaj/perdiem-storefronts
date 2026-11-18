import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-control bg-background text-foreground">
          <Store aria-hidden className="size-4" />
        </span>
        Per Diem
      </span>
      <nav aria-label="Site" className="flex items-center gap-6 text-sm font-medium opacity-80">
        <a href="#try" className="hidden hover:opacity-100 sm:inline">
          Try it
        </a>
        <Link href="/admin" className="hover:opacity-100">
          Admin
        </Link>
      </nav>
    </header>
  );
}

export function AdminCallout() {
  return (
    <section className="border-t border-foreground/10 py-16 md:py-24">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Edits go live on the next request
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Change a price, mark a dish sold out or switch a layout. Only that restaurant&apos;s
            pages are refreshed.
          </p>
        </div>
        <Link
          href="/admin"
          className="press inline-flex h-11 shrink-0 items-center gap-2 rounded-control bg-foreground px-5 font-semibold text-background"
        >
          Open the admin <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        A take-home project for Per Diem. The restaurants are fictional.
      </p>
    </footer>
  );
}
