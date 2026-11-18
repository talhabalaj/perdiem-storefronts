"use client";

import { useMenu } from "@/components/menu/useMenu";
import { useStore } from "@/components/storefront/StoreContext";
import type { MenuItem } from "@/lib/schemas";
import { useCart } from "./cart-store";

export interface OrderRow {
  item: MenuItem;
  quantity: number;
}

/**
 * The cart joined against the live menu query: deleted items drop out, and price or sold-out
 * changes made in the admin apply to the order immediately.
 */
export function useOrder() {
  const { id } = useStore();
  const cart = useCart(id);
  const items = new Map(
    useMenu()
      .flatMap((category) => category.items)
      .map((item) => [item.id, item]),
  );
  const rows: OrderRow[] = cart.lines.flatMap((line) => {
    const item = items.get(line.itemId);
    return item ? [{ item, quantity: line.quantity }] : [];
  });
  const payable = rows.filter((row) => !row.item.soldOut);
  return {
    ...cart,
    rows,
    count: payable.reduce((sum, row) => sum + row.quantity, 0),
    subtotal: payable.reduce((sum, row) => sum + row.item.priceCents * row.quantity, 0),
  };
}
