"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

/**
 * Cart = item ids + quantities, persisted per store in localStorage. Names and prices are
 * never copied in: they are joined from the live menu query, so they can't go stale.
 * Keying by store id keeps carts apart even when stores share an origin (path mode).
 */
const CartSchema = z.array(
  z.object({ itemId: z.number().int(), quantity: z.number().int().positive() }),
);
export type CartLine = z.infer<typeof CartSchema>[number];

const EMPTY: CartLine[] = [];
const cache = new Map<number, CartLine[]>();
const listeners = new Set<() => void>();
const storageKey = (storeId: number) => `cart:${storeId}`;

function read(storeId: number): CartLine[] {
  const cached = cache.get(storeId);
  if (cached) return cached;
  let lines = EMPTY;
  try {
    const parsed = CartSchema.safeParse(
      JSON.parse(localStorage.getItem(storageKey(storeId)) ?? "[]"),
    );
    if (parsed.success) lines = parsed.data;
  } catch {
    // Unavailable storage (private mode, blocked cookies) just means an in-memory cart.
  }
  cache.set(storeId, lines);
  return lines;
}

function write(storeId: number, lines: CartLine[]): void {
  cache.set(storeId, lines);
  try {
    localStorage.setItem(storageKey(storeId), JSON.stringify(lines));
  } catch {
    // Same as above: keep working in memory.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab changed a cart: drop our copy and re-read.
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith("cart:")) {
      cache.clear();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(storeId: number) {
  const lines = useSyncExternalStore(
    subscribe,
    () => read(storeId),
    () => EMPTY,
  );

  // Updates in place so a line never jumps while someone is tapping its stepper.
  const setQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      write(
        storeId,
        lines.filter((line) => line.itemId !== itemId),
      );
      return;
    }
    write(
      storeId,
      lines.map((line) => (line.itemId === itemId ? { itemId, quantity } : line)),
    );
  };
  const add = (itemId: number) => {
    const existing = lines.find((line) => line.itemId === itemId);
    if (!existing) {
      write(storeId, [...lines, { itemId, quantity: 1 }]);
      return;
    }
    write(
      storeId,
      lines.map((line) =>
        line.itemId === itemId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    );
  };

  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    add,
    setQuantity,
    clear: () => write(storeId, EMPTY),
    restore: (previous: CartLine[]) => write(storeId, previous),
  };
}
