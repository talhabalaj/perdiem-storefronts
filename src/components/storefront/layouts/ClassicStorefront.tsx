import Image from "next/image";
import { isImageSource, isOptimizable } from "@/lib/theme/image";
import { MenuRows } from "@/components/menu/MenuRows";
import type { Store } from "@/lib/schemas";
import { StoreFacts } from "../StoreFacts";
import { Storefront } from "../Storefront";

/** Type-led: the store's name, set huge, is the hero; the photo supports it. */
export function ClassicStorefront({ store, basePath }: { store: Store; basePath: string }) {
  const hero = (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-7 pb-7 md:grid-cols-[1.3fr_1fr] md:items-end md:pt-10 md:pb-8">
      <div>
        <h1 className="font-heading text-[clamp(3.75rem,16vw,10.5rem)] leading-[0.82] tracking-[-0.02em] text-balance">
          {store.name}
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground md:mt-6">{store.tagline}</p>
        <div className="mt-4 md:mt-6">
          <StoreFacts address={store.address} />
        </div>
      </div>
      {isImageSource(store.theme.heroImageUrl) ? (
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-card md:block">
          <Image
            src={store.theme.heroImageUrl}
            unoptimized={!isOptimizable(store.theme.heroImageUrl)}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
  return <Storefront store={store} basePath={basePath} hero={hero} menu={<MenuRows />} />;
}
