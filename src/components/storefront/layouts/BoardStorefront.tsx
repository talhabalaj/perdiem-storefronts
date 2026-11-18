import Image from "next/image";
import { isImageSource, isOptimizable } from "@/lib/theme/image";
import { MenuBoard } from "@/components/menu/MenuBoard";
import type { Store } from "@/lib/schemas";
import { StoreFacts } from "../StoreFacts";
import { Storefront } from "../Storefront";

/** Signage-led: the name fills the width like letters on a smokehouse sign. */
export function BoardStorefront({ store, basePath }: { store: Store; basePath: string }) {
  const hero = (
    <section className="border-b-[6px] border-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-6 md:pt-10 md:pb-7">
        <h1 className="font-heading text-[clamp(4.75rem,19vw,10.5rem)] leading-[0.8] font-black uppercase">
          {store.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 md:mt-6">
          <p className="max-w-md text-xl leading-snug font-medium">{store.tagline}</p>
          <StoreFacts address={store.address} />
        </div>
      </div>
      {isImageSource(store.theme.heroImageUrl) ? (
        <div className="relative hidden h-40 sm:block">
          <Image
            src={store.theme.heroImageUrl}
            unoptimized={!isOptimizable(store.theme.heroImageUrl)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
  return <Storefront store={store} basePath={basePath} hero={hero} menu={<MenuBoard />} />;
}
