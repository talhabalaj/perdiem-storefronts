"use client";

import { UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { useMenu } from "./useMenu";

/** Shows the menu once it has dishes; a brand-new store gets an honest empty state instead. */
export function MenuGate({ storeName, children }: { storeName: string; children: ReactNode }) {
  if (useMenu().length > 0) return children;
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <UtensilsCrossed aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
      <h2 className="font-heading text-2xl">The menu is on its way</h2>
      <p className="text-muted-foreground">
        {storeName} hasn&apos;t added any dishes yet. Check back soon.
      </p>
    </div>
  );
}
