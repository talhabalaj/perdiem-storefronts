"use client";

import type { MenuItem } from "@/lib/schemas";
import { categoryAnchor } from "./CategoryNav";
import { Price } from "./Price";
import { QuantityControl } from "./QuantityControl";
import { useMenu } from "./useMenu";

/** Board: a pitmaster's menu board. Signage headings, dotted leaders from dish to price. */
export function MenuBoard() {
  const menu = useMenu();
  return (
    <div className="space-y-14">
      {menu.map((category) => (
        <section key={category.id} id={categoryAnchor(category.id)} className="scroll-mt-32">
          <h2 className="border-b-[6px] border-foreground pb-1 font-heading text-6xl leading-[0.85] font-black uppercase sm:text-8xl">
            {category.name}
          </h2>
          <ul>
            {category.items.map((item) => (
              <BoardLine key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BoardLine({ item }: { item: MenuItem }) {
  const name = `font-heading text-2xl leading-tight font-extrabold uppercase sm:text-3xl ${item.soldOut ? "line-through decoration-2" : ""}`;
  const price = "font-heading text-2xl font-extrabold text-primary sm:text-3xl";
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-foreground/20 py-4">
      {/* Phones: name, description, then price beside the control. Wider: a board line with leaders. */}
      <div className="col-span-2 flex items-baseline gap-2 sm:col-span-1">
        <h3 className={name}>{item.name}</h3>
        <span
          aria-hidden
          className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-foreground/40 sm:block"
        />
        <Price cents={item.priceCents} unit={item.unit} className={`hidden sm:inline ${price}`} />
      </div>
      <p className="col-span-2 text-sm text-muted-foreground sm:col-span-1">{item.description}</p>
      <Price cents={item.priceCents} unit={item.unit} className={`sm:hidden ${price}`} />
      {/* Reserve the stepper's width so swapping Add for it never reflows the row. */}
      <div className="flex min-w-[7.75rem] justify-end sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:min-w-[6.5rem]">
        <QuantityControl item={item} />
      </div>
    </li>
  );
}
