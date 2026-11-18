import { MapPin } from "lucide-react";
import { OpenStatus } from "./OpenStatus";

/** The two facts a hungry person needs before anything else: is it open, and where is it. */
export function StoreFacts({ address }: { address: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <OpenStatus />
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <MapPin aria-hidden className="size-4" strokeWidth={1.75} />
        {address}
      </span>
    </div>
  );
}
