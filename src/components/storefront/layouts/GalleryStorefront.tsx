import Image from "next/image";
import { isImageSource, isOptimizable } from "@/lib/theme/image";
import { MenuGallery } from "@/components/menu/MenuGallery";
import type { Store } from "@/lib/schemas";
import { StoreFacts } from "../StoreFacts";
import { Storefront } from "../Storefront";

/** Food-led: one big round bowl, then a gallery of round bowls. */
export function GalleryStorefront({ store, basePath }: { store: Store; basePath: string }) {
  const hero = (
    <section className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-4 px-4 pt-4 pb-4 md:gap-x-10 md:pt-10 md:pb-10">
      <h1 className="font-heading text-[clamp(3rem,12vw,7.5rem)] leading-[0.88] font-extrabold tracking-[-0.03em]">
        {store.name}
      </h1>
      {isImageSource(store.theme.heroImageUrl) ? (
        <div className="relative row-span-1 aspect-square w-28 overflow-hidden rounded-full sm:w-56 md:row-span-3 md:w-[16rem]">
          <Image
            src={store.theme.heroImageUrl}
            unoptimized={!isOptimizable(store.theme.heroImageUrl)}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 256px, 224px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="col-span-2 md:col-span-1">
        <p className="max-w-md text-lg text-muted-foreground">{store.tagline}</p>
        <div className="mt-4 md:mt-6">
          <StoreFacts address={store.address} />
        </div>
      </div>
    </section>
  );
  return <Storefront store={store} basePath={basePath} hero={hero} menu={<MenuGallery />} />;
}
