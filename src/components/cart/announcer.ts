"use client";

import { useSyncExternalStore } from "react";

// One persistent live region for the whole page: screen readers hear each order change once,
// instead of every remounted button announcing itself.
let message = "";
const listeners = new Set<() => void>();

export function announce(text: string): void {
  message = text;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAnnouncement(): string {
  return useSyncExternalStore(
    subscribe,
    () => message,
    () => "",
  );
}
