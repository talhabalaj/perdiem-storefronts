import { MapPin, Phone } from "lucide-react";
import { formatClockTime, formatWeekday } from "@/lib/hours";
import type { Store } from "@/lib/schemas";

// Monday-first, which is how most menus print opening hours.
const WEEK = [1, 2, 3, 4, 5, 6, 0];

export function StoreFooter({ store }: { store: Store }) {
  return (
    <footer className="mt-24 border-t border-foreground/10 pb-28 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="font-heading text-2xl">{store.name}</p>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            {store.address}
          </p>
          <a
            href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Phone aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            {store.phone}
          </a>
        </div>
        <div>
          <h2 className="mb-3 font-heading text-lg">Opening hours</h2>
          <table className="w-full max-w-xs text-sm">
            <tbody>
              {WEEK.map((day) => {
                const ranges = store.hours.filter((range) => range.day === day);
                const label = ranges
                  .map(
                    (r) =>
                      `${formatClockTime(r.open, store.locale)}–${formatClockTime(r.close, store.locale)}`,
                  )
                  .join(", ");
                return (
                  <tr key={day}>
                    <th scope="row" className="py-1 pr-4 text-left font-medium">
                      {formatWeekday(day, store.locale)}
                    </th>
                    <td className="py-1 text-right text-muted-foreground tabular-nums">
                      {label || "Closed"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  );
}
