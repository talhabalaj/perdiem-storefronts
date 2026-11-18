"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/schemas";
import { useUpdateItem } from "./useUpdateItem";

const input =
  "h-10 w-full rounded-control border border-foreground/50 bg-background px-2.5 text-sm hover:border-foreground/70 focus:border-foreground sm:h-9 sm:border-transparent sm:bg-transparent sm:hover:border-foreground/30";

/** Phones: a stacked card (name, description, then price and availability). Wider: a table row. */
export function MenuItemRow({
  slug,
  item,
  currency,
}: {
  slug: string;
  item: MenuItem;
  currency: string;
}) {
  const update = useUpdateItem(slug, item.id);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState((item.priceCents / 100).toFixed(2));
  const priceCents = Math.round(Number(price) * 100);
  const priceValid = price.trim() !== "" && Number.isFinite(priceCents) && priceCents >= 0;
  const dirty =
    name !== item.name || description !== item.description || priceCents !== item.priceCents;

  return (
    <tr className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 gap-y-2 px-3 py-3 sm:table-row sm:p-0">
      <td className="col-span-3 sm:px-2 sm:py-1.5">
        <input
          aria-label={`${item.name} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${input} font-medium`}
        />
      </td>
      <td className="col-span-3 sm:table-cell sm:px-2 sm:py-1.5">
        <input
          aria-label={`${item.name} description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${input} text-muted-foreground`}
        />
      </td>
      <td className="sm:w-32 sm:px-2 sm:py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{currency}</span>
          <input
            aria-label={`${item.name} price`}
            aria-invalid={!priceValid}
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${input} w-24 text-right tabular-nums aria-[invalid=true]:border-red-600`}
          />
        </div>
      </td>
      <td className="sm:w-36 sm:px-4 sm:py-1.5">
        <Switch
          checked={!item.soldOut}
          label={`${item.name} available`}
          onChange={(available) => update.mutate({ soldOut: !available })}
        />
      </td>
      <td className="text-right sm:w-24 sm:px-2 sm:py-1.5">
        {dirty ? (
          <button
            type="button"
            disabled={!priceValid || update.isPending}
            onClick={() => update.mutate({ name, description, priceCents })}
            className="press h-10 rounded-control bg-foreground px-3 text-xs font-semibold text-background disabled:opacity-40 sm:h-8"
          >
            Save
          </button>
        ) : null}
        {update.isError ? (
          <span role="alert" className="block text-xs text-red-700">
            {update.error.message}
          </span>
        ) : null}
      </td>
    </tr>
  );
}

function Switch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        aria-label={label}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-6 w-10 rounded-full bg-foreground/25 transition-colors peer-checked:bg-emerald-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:ease-[var(--ease-out)] peer-checked:after:translate-x-4 motion-reduce:after:transition-none"
      />
      <span className="whitespace-nowrap">{checked ? "On sale" : "Sold out"}</span>
    </label>
  );
}
