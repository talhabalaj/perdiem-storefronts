"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useNow } from "@/components/storefront/useNow";
import { describeOpenStatus, formatClockTime, formatWeekday, getOpenStatus } from "@/lib/hours";
import { formatMoney } from "@/lib/money";
import type { MenuItem, Store } from "@/lib/schemas";
import { FONT_LABELS } from "@/lib/theme/font-tokens";
import { COLOR_KEYS, COLOR_LABELS, LAYOUT_NAMES } from "./labels";
import { Panel } from "./Panel";
import { useAdminStore } from "./useAdminStore";

const WEEK = [1, 2, 3, 4, 5, 6, 0];
const fontName = (label: string) => label.split(" (")[0];

export function StoreOverview() {
  const { slug, store, menu } = useAdminStore();
  const items = menu.flatMap((category) => category.items);
  const soldOut = items.filter((item) => item.soldOut);
  const editLink = (href: string, label: string) => (
    <Link
      href={`/admin/${slug}/${href}`}
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {label} <ArrowUpRight aria-hidden className="size-3.5" />
    </Link>
  );

  return (
    <div className="space-y-6">
      <StatStrip
        store={store}
        items={items.length}
        soldOut={soldOut.length}
        sections={menu.length}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Brand"
          description={`${LAYOUT_NAMES[store.theme.layout]} layout`}
          action={editLink("branding", "Edit branding")}
        >
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {COLOR_KEYS.map((key) => (
              <li key={key} className="space-y-1.5" title={COLOR_LABELS[key]}>
                <span
                  aria-hidden
                  className="block aspect-square rounded-control ring-1 ring-foreground/10"
                  style={{ backgroundColor: store.theme.colors[key] }}
                />
                <span className="block truncate text-[0.6875rem] text-muted-foreground">
                  {store.theme.colors[key]}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Headings in {fontName(FONT_LABELS[store.theme.fontHeading])}, text in{" "}
            {fontName(FONT_LABELS[store.theme.fontBody])}.
          </p>
        </Panel>
        <Panel title="Sold out right now" action={editLink("menu", "Manage menu")}>
          <SoldOutList store={store} items={soldOut} />
        </Panel>
        <Panel title="Opening hours" description={store.timezone}>
          <HoursList store={store} />
        </Panel>
        <Panel title="Location">
          <p className="text-sm">{store.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">{store.phone}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Prices in {store.currency}, formatted for {store.locale}.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function StatStrip({
  store,
  items,
  soldOut,
  sections,
}: {
  store: Store;
  items: number;
  soldOut: number;
  sections: number;
}) {
  const now = useNow();
  const status = now
    ? describeOpenStatus(getOpenStatus(store.hours, store.timezone, now), store.locale)
    : "…";
  const city = store.timezone.split("/").pop()?.replace("_", " ") ?? store.timezone;
  const stats = [
    { label: "Menu items", value: String(items) },
    { label: "Sold out", value: String(soldOut) },
    { label: "Menu sections", value: String(sections) },
    { label: `Right now in ${city}`, value: status },
  ];
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-card border border-foreground/10 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-foreground/10 p-5 not-last:border-b odd:border-r lg:border-b-0 lg:not-last:border-r"
        >
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SoldOutList({ store, items }: { store: Store; items: MenuItem[] }) {
  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">Everything on the menu is available.</p>;
  return (
    <ul className="divide-y divide-foreground/10 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex justify-between py-2 first:pt-0 last:pb-0">
          <span>{item.name}</span>
          <span className="text-muted-foreground tabular-nums">
            {formatMoney(item.priceCents, store.currency, store.locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function HoursList({ store }: { store: Store }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
      {WEEK.map((day) => {
        const ranges = store.hours.filter((range) => range.day === day);
        const label = ranges
          .map(
            (r) =>
              `${formatClockTime(r.open, store.locale)}–${formatClockTime(r.close, store.locale)}`,
          )
          .join(", ");
        return (
          <div key={day} className="contents">
            <dt className="font-medium">{formatWeekday(day, store.locale)}</dt>
            <dd className="text-muted-foreground tabular-nums">{label || "Closed"}</dd>
          </div>
        );
      })}
    </dl>
  );
}
