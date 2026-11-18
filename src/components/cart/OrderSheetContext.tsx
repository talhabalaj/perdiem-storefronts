"use client";

import { createContext, use, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { useAnnouncement } from "./announcer";
import { OrderSheet } from "./OrderSheet";

// The context carries the (stable) dialog ref, so its value never changes between renders.
const OrderSheetContext = createContext<RefObject<HTMLDialogElement | null> | null>(null);

/** Renders the one order sheet for the page and lets any button open it. */
export function OrderSheetProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <OrderSheetContext value={dialogRef}>
      {children}
      <OrderSheet dialogRef={dialogRef} />
      <Announcer />
    </OrderSheetContext>
  );
}

export function useOpenOrder(): () => void {
  const dialogRef = use(OrderSheetContext);
  if (!dialogRef) throw new Error("useOpenOrder must be used inside <OrderSheetProvider>");
  return () => dialogRef.current?.showModal();
}

function Announcer() {
  return <output className="sr-only">{useAnnouncement()}</output>;
}
