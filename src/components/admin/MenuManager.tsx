"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import type { Category, MenuItem } from "@/lib/schemas";
import { MenuItemRow } from "./MenuItemRow";
import { useAdminStore } from "./useAdminStore";

type Filter = "all" | "soldOut";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All items" },
  { value: "soldOut", label: "Sold out" },
];

export function MenuManager() {
  const { slug, store, menu } = useAdminStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const needle = query.trim().toLowerCase();
  const matches = (item: MenuItem) =>
    (filter === "all" || item.soldOut) &&
    (needle === "" || `${item.name} ${item.description}`.toLowerCase().includes(needle));
  const sections = menu
    .map((category) => ({ category, items: category.items.filter(matches) }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search the menu</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes"
            className="h-9 w-full rounded-control border border-foreground/50 bg-background pr-3 pl-9 text-sm"
          />
        </label>
        <fieldset className="inline-flex rounded-control border border-foreground/15 p-0.5">
          <legend className="sr-only">Show</legend>
          {FILTERS.map(({ value, label }) => (
            <label
              key={value}
              className="relative cursor-pointer rounded-control px-3 py-1.5 text-sm text-muted-foreground has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground"
            >
              <input
                type="radio"
                name="menu-filter"
                value={value}
                checked={filter === value}
                onChange={() => setFilter(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
      <MenuTable slug={slug} currency={store.currency} sections={sections} />
      {sections.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {filter === "soldOut" && needle === ""
            ? "Nothing is sold out."
            : "No dishes match your search."}
        </p>
      ) : null}
    </div>
  );
}

function MenuTable({
  slug,
  currency,
  sections,
}: {
  slug: string;
  currency: string;
  sections: { category: Category; items: MenuItem[] }[];
}) {
  const th = "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground";
  return (
    <div className="relative overflow-x-auto rounded-card border border-foreground/10">
      <table className="w-full text-sm">
        <thead className="hidden border-b border-foreground/10 bg-muted/50 sm:table-header-group">
          <tr>
            <th className={th}>Dish</th>
            <th className={`${th} hidden sm:table-cell`}>Description</th>
            <th className={`${th} text-right`}>Price</th>
            <th className={th}>Availability</th>
            <th className={th}>
              <span className="sr-only">Save</span>
            </th>
          </tr>
        </thead>
        {sections.map(({ category, items }) => (
          <tbody
            key={category.id}
            className="divide-y divide-foreground/10 border-b border-foreground/10 last:border-b-0"
          >
            <tr>
              <th
                colSpan={5}
                scope="colgroup"
                className="bg-muted/30 px-4 py-2 text-left text-xs font-semibold"
              >
                {category.name}
              </th>
            </tr>
            {items.map((item) => (
              <MenuItemRow
                key={`${item.id}:${item.name}:${item.priceCents}:${item.description}`}
                slug={slug}
                item={item}
                currency={currency}
              />
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
