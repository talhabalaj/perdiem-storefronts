"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { announce } from "@/components/cart/announcer";
import { useCart } from "@/components/cart/cart-store";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useStore } from "@/components/storefront/StoreContext";
import type { MenuItem } from "@/lib/schemas";

/** "Add" until the item is in the order, then an inline stepper. No trip to the cart needed. */
export function QuantityControl({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const { id: storeId } = useStore();
  const { lines, add, setQuantity } = useCart(storeId);
  const quantity = lines.find((line) => line.itemId === item.id)?.quantity ?? 0;
  // Which control should take focus after the Add button and stepper swap places.
  const [focusAfterSwap, setFocusAfterSwap] = useState<"stepper" | "add" | null>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (focusAfterSwap === "add") addRef.current?.focus();
  }, [focusAfterSwap]);

  if (item.soldOut) {
    return (
      <span className="inline-flex h-7 items-center rounded-control bg-background px-2.5 text-xs font-semibold text-muted-foreground ring-1 ring-foreground/15">
        Sold out
      </span>
    );
  }
  if (quantity > 0) {
    const change = (next: number) => {
      setQuantity(item.id, next);
      if (next === 0) setFocusAfterSwap("add");
      announce(next === 0 ? `Removed ${item.name}.` : `${item.name}: ${next} in your order.`);
    };
    return (
      <QuantityStepper
        name={item.name}
        quantity={quantity}
        onChange={change}
        focusPlus={focusAfterSwap === "stepper"}
      />
    );
  }
  return (
    <button
      ref={addRef}
      type="button"
      onClick={() => {
        add(item.id);
        setFocusAfterSwap("stepper");
        announce(`Added ${item.name}. 1 in your order.`);
      }}
      aria-label={`Add ${item.name} to order`}
      className={`press inline-flex h-11 items-center justify-center gap-1 rounded-control bg-primary font-semibold text-primary-foreground hover:opacity-90 sm:h-9 ${compact ? "w-11 sm:w-9" : "px-4 text-sm"}`}
    >
      <Plus aria-hidden className="size-4" strokeWidth={2.5} />
      {compact ? null : "Add"}
    </button>
  );
}
