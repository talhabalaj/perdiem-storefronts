"use client";

import { ShoppingBag } from "lucide-react";
import { useOpenOrder } from "./OrderSheetContext";
import { useOrder } from "./useOrder";

/** Header entry point to the order; the count is announced with the label. */
export function OrderButton() {
  const { count } = useOrder();
  const openOrder = useOpenOrder();
  return (
    <button
      type="button"
      onClick={openOrder}
      aria-haspopup="dialog"
      aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}`}
      className="press inline-flex h-11 items-center sm:h-10 gap-2 rounded-control bg-primary px-3.5 text-sm font-semibold text-primary-foreground"
    >
      <ShoppingBag aria-hidden className="size-4.5" />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
