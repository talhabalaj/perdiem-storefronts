"use client";

import { useStore } from "@/components/storefront/StoreContext";
import { formatMoney } from "@/lib/money";

/** "$18.00", or "$18.00 per ½ lb" when the item is sold by weight or portion. */
export function Price({
  cents,
  unit = null,
  className = "",
}: {
  cents: number;
  unit?: string | null;
  className?: string;
}) {
  const { currency, locale } = useStore();
  return (
    <span className={`tabular-nums ${className}`}>
      {formatMoney(cents, currency, locale)}
      {unit ? (
        <span className="ml-1 text-[0.7em] font-medium whitespace-nowrap opacity-80">
          per {unit}
        </span>
      ) : null}
    </span>
  );
}
