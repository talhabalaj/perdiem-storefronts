"use client";

import { ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useStore } from "@/components/storefront/StoreContext";
import { formatMoney } from "@/lib/money";
import { announce } from "./announcer";
import type { CartLine } from "./cart-store";
import { QuantityStepper } from "./QuantityStepper";
import { useOrder } from "./useOrder";
import type { OrderRow } from "./useOrder";

export function OrderSheet({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const { name, currency, locale } = useStore();
  const { lines, rows, subtotal, setQuantity, clear, restore } = useOrder();
  // Clearing is one tap, so it is also one tap to undo.
  const [cleared, setCleared] = useState<CartLine[] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = () => dialogRef.current?.close();
  const clearOrder = () => {
    setCleared(lines);
    clear();
    announce("Order cleared.");
  };
  const undoClear = () => {
    if (cleared) restore(cleared);
    setCleared(null);
    announce("Order restored.");
    // Undo unmounts itself; keep keyboard focus inside the dialog.
    closeRef.current?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Your order from ${name}`}
      closedby="any"
      className="order-sheet mt-auto mb-0 max-h-[85dvh] w-full max-w-none rounded-t-card bg-background p-0 text-foreground sm:m-0 sm:ml-auto sm:h-dvh sm:max-h-none sm:max-w-md sm:rounded-none"
    >
      <div className="flex h-full max-h-[85dvh] flex-col sm:max-h-none">
        <header className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="font-heading text-2xl">Your order</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close order"
            className="press grid size-11 place-items-center rounded-control hover:bg-muted"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>
        {rows.length === 0 ? (
          <EmptyOrder cleared={cleared !== null} onUndo={undoClear} onBrowse={close} />
        ) : (
          <>
            <ul className="flex-1 divide-y divide-foreground/10 overflow-y-auto px-5">
              {rows.map((row) => (
                <OrderLine
                  key={row.item.id}
                  row={row}
                  money={(c) => formatMoney(c, currency, locale)}
                  onQuantity={(q) => setQuantity(row.item.id, q)}
                />
              ))}
            </ul>
            <footer className="space-y-3 border-t border-foreground/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="text-xl font-semibold tabular-nums" data-testid="cart-subtotal">
                  {formatMoney(subtotal, currency, locale)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Checkout isn&apos;t part of this take-home.
                </p>
                <button
                  type="button"
                  onClick={clearOrder}
                  className="press h-10 shrink-0 rounded-control border border-foreground/20 px-3 text-sm font-medium hover:bg-muted"
                >
                  Clear order
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}

function EmptyOrder({
  cleared,
  onUndo,
  onBrowse,
}: {
  cleared: boolean;
  onUndo: () => void;
  onBrowse: () => void;
}) {
  const undoRef = useRef<HTMLButtonElement>(null);
  // Clear order unmounts the button that had focus; hand it to Undo.
  useEffect(() => {
    if (cleared) undoRef.current?.focus();
  }, [cleared]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-14 text-center">
      <ShoppingBag aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
      <p className="text-muted-foreground">{cleared ? "Order cleared." : "Your order is empty."}</p>
      <div className="flex gap-3">
        {cleared ? (
          <button
            ref={undoRef}
            type="button"
            onClick={onUndo}
            className="press h-11 rounded-control border border-foreground/20 px-5 font-semibold hover:bg-muted"
          >
            Undo
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBrowse}
          className="press h-11 rounded-control bg-primary px-5 font-semibold text-primary-foreground"
        >
          Browse the menu
        </button>
      </div>
    </div>
  );
}

function OrderLine({
  row,
  money,
  onQuantity,
}: {
  row: OrderRow;
  money: (cents: number) => string;
  onQuantity: (quantity: number) => void;
}) {
  const { item, quantity } = row;
  const portion = item.unit ? `${quantity} × ${item.unit}, ` : "";
  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {item.soldOut
            ? "Sold out since you added it"
            : `${portion}${money(item.priceCents * quantity)}`}
        </p>
      </div>
      {item.soldOut ? (
        <button
          type="button"
          onClick={() => onQuantity(0)}
          className="press h-11 rounded-control px-3 text-sm font-medium underline underline-offset-2 sm:h-9"
        >
          Remove
        </button>
      ) : (
        <QuantityStepper name={item.name} quantity={quantity} onChange={onQuantity} />
      )}
    </li>
  );
}
