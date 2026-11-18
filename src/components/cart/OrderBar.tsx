"use client";

import { ShoppingBag } from "lucide-react";
import { useStore } from "@/components/storefront/StoreContext";
import { formatMoney } from "@/lib/money";
import { useOpenOrder } from "./OrderSheetContext";
import { useOrder } from "./useOrder";

/** Phone/tablet: the order is always one tap away once it has something in it. */
export function OrderBar() {
  const { currency, locale } = useStore();
  const { rows, count, subtotal } = useOrder();
  const openOrder = useOpenOrder();
  if (rows.length === 0) return null;

  return (
    <div className="order-bar fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <button
        type="button"
        onClick={openOrder}
        className="press mx-auto flex w-full max-w-xl items-center gap-3 rounded-control bg-primary px-5 py-3.5 text-primary-foreground shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)]"
      >
        <span className="relative">
          <ShoppingBag aria-hidden className="size-5" />
          <span className="absolute -top-2 -right-2.5 grid min-w-4.5 place-items-center rounded-full bg-primary-foreground px-1 text-[0.6875rem] font-bold text-primary tabular-nums">
            {count}
          </span>
        </span>
        <span className="font-semibold">View order</span>
        <span className="ml-auto font-semibold tabular-nums">
          {count > 0 ? formatMoney(subtotal, currency, locale) : "Items unavailable"}
        </span>
      </button>
    </div>
  );
}
