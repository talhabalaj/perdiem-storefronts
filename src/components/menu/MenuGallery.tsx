"use client";

import Image from "next/image";
import type { MenuItem } from "@/lib/schemas";
import { categoryAnchor } from "./CategoryNav";
import { Price } from "./Price";
import { QuantityControl } from "./QuantityControl";
import { useMenu } from "./useMenu";

/** Gallery: the dish is the hero. Round photos, because bowls are round. */
export function MenuGallery() {
  const menu = useMenu();
  return (
    <div className="space-y-14">
      {menu.map((category) => (
        <section key={category.id} id={categoryAnchor(category.id)} className="scroll-mt-32">
          <h2 className="mb-6 font-heading text-3xl font-extrabold sm:text-4xl">{category.name}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {category.items.map((item) => (
              <Tile key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Tile({ item }: { item: MenuItem }) {
  return (
    <li className="flex flex-col items-center text-center">
      <div
        className={`relative aspect-square w-full max-w-48 overflow-hidden rounded-full bg-muted ${item.soldOut ? "opacity-50 grayscale" : ""}`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 192px, 45vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <h3 className="mt-3 font-heading text-lg leading-snug font-bold">{item.name}</h3>
      {/* Price and Add sit right under the name; the full ingredient list follows. */}
      <Price cents={item.priceCents} unit={item.unit} className="mt-1 font-semibold" />
      <div className="mt-2">
        <QuantityControl item={item} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
    </li>
  );
}
