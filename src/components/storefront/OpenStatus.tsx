"use client";

import { Clock } from "lucide-react";
import { describeOpenStatus, getOpenStatus } from "@/lib/hours";
import { useStore } from "./StoreContext";
import { useNow } from "./useNow";

/** "Open until 5 PM" with a live dot. Rendered on the client so it uses the viewer's clock. */
export function OpenStatus() {
  const { hours, timezone, locale } = useStore();
  const now = useNow();
  if (!now)
    return <span className="inline-block h-5 w-32 animate-pulse rounded-control bg-muted" />;

  const status = getOpenStatus(hours, timezone, now);
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      <Clock aria-hidden className="size-4 text-muted-foreground" strokeWidth={1.75} />
      {describeOpenStatus(status, locale)}
      {status.isOpen ? (
        <span aria-hidden className="ml-0.5 size-1.5 rounded-full bg-accent" />
      ) : null}
    </span>
  );
}
