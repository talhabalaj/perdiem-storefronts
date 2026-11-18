import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { loadDirectory } from "@/components/platform/directory";
import { AdminCallout, LandingFooter, LandingHeader } from "@/components/platform/landing/Chrome";
import { Controls } from "@/components/platform/landing/Controls";
import { HowItWorks } from "@/components/platform/landing/HowItWorks";
import { PhoneFan } from "@/components/platform/landing/PhoneFan";
import { DirectoryDemo } from "@/components/platform/StoreDirectory";

export const metadata: Metadata = {
  title: "Per Diem: every restaurant's own ordering app",
  description:
    "A Per Diem take-home: one codebase that becomes each restaurant's own branded storefront, chosen by the address you visit.",
};

export default function Landing() {
  return (
    <div className="min-h-dvh">
      <div className="overflow-x-clip bg-foreground text-background [--focus-ring:var(--background)]">
        <LandingHeader />
        <section className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pt-6 pb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:pt-12 md:pb-24">
          <div>
            <h1 className="text-[clamp(2.75rem,6.2vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance">
              Every restaurant gets its own app. They all run on one.
            </h1>
            <p className="mt-6 max-w-md text-lg text-background/75">
              Per Diem gives independent cafés and restaurants the branded ordering their regulars
              expect from the big chains. This is the core of it: one codebase that becomes each
              restaurant&apos;s own storefront, with its own brand, menu and hours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#try"
                className="press inline-flex h-11 items-center gap-2 rounded-control bg-background px-5 font-semibold text-foreground"
              >
                Try it live <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link
                href="/admin"
                className="font-semibold underline decoration-background/40 underline-offset-4 hover:decoration-background"
              >
                Open the admin
              </Link>
            </div>
          </div>
          <Suspense fallback={<div className="h-[26rem] sm:h-[30rem]" />}>
            <HeroPhones />
          </Suspense>
        </section>
      </div>
      <main className="mx-auto max-w-6xl px-4">
        <section
          id="try"
          aria-labelledby="try-heading"
          className="grid scroll-mt-6 grid-cols-[minmax(0,1fr)] gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-14 md:py-24"
        >
          <div>
            <h2
              id="try-heading"
              className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
            >
              The address picks the restaurant
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Pick an address and the same app answers as a different restaurant. These are the real
              themes and dishes, drawn with each store&apos;s own tokens.
            </p>
          </div>
          <Suspense fallback={<div className="aspect-[4/3] animate-pulse rounded-card bg-muted" />}>
            <DirectoryDemo />
          </Suspense>
        </section>
        <HowItWorks />
        <Controls />
        <AdminCallout />
      </main>
      <LandingFooter />
    </div>
  );
}

async function HeroPhones() {
  return <PhoneFan stores={await loadDirectory()} />;
}
