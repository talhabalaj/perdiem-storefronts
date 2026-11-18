"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribe(onTick: () => void): () => void {
  const id = window.setInterval(onTick, 15_000);
  return () => window.clearInterval(id);
}

// Snapshot is the current minute, so it is stable between ticks (a useSyncExternalStore rule).
const currentMinute = () => Math.floor(Date.now() / MINUTE);

/** The current time, ticking each minute. Null during SSR so time never causes a mismatch. */
export function useNow(): Date | null {
  const minute = useSyncExternalStore<number | null>(subscribe, currentMinute, () => null);
  return minute === null ? null : new Date(minute * MINUTE);
}
