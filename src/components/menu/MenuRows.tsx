"use client";

import Image from "next/image";
import type { MenuItem } from "@/lib/schemas";
import { categoryAnchor } from "./CategoryNav";
import { Price } from "./Price";
import { QuantityControl } from "./QuantityControl";
import { useMenu } from "./useMenu";

/** Classic: dense rows (text left, photo right) so a phone screen shows several dishes. */
export function MenuRows() {
  const menu = useMenu();
  return (
    <div className="space-y-12">
      {menu.map((category) => (
        <section key={category.id} id={categoryAnchor(category.id)} className="scroll-mt-32">
          <h2 className="mb-2 font-heading text-4xl leading-none sm:text-5xl">{category.name}</h2>
          <ul className="grid divide-y divide-foreground/10 md:grid-cols-2 md:gap-x-12 md:divide-y-0">
            {category.items.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Row({ item }: { item: MenuItem }) {
  return (
    <li className="flex gap-4 py-5 md:border-b md:border-foreground/10">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-base font-semibold">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <Price cents={item.priceCents} unit={item.unit} className="mt-1 font-semibold" />
      </div>
      <div className="relative shrink-0 self-start">
        {item.imageUrl ? (
          <div
            className={`relative size-24 overflow-hidden rounded-card bg-muted sm:size-28 ${item.soldOut ? "opacity-50 grayscale" : ""}`}
          >
            <Image src={item.imageUrl} alt="" fill sizes="112px" className="object-cover" />
          </div>
        ) : null}
        <div className={item.imageUrl ? "absolute -right-1.5 -bottom-1.5" : ""}>
          <QuantityControl item={item} compact />
        </div>
      </div>
    </li>
  );
}
