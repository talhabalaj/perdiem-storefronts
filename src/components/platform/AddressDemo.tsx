"use client";

import { ArrowUpRight, Lock, RotateCw } from "lucide-react";
import { useState } from "react";
import { StorePreview } from "@/components/theme/StorePreview";
import type { PreviewItem } from "@/components/theme/StorePreview";
import type { Theme } from "@/lib/schemas";

export interface DemoAddress {
  href: string;
  label: string;
  store: { name: string; theme: Theme; items: PreviewItem[] };
}

const display = (href: string) => href.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The product in one interaction: choose an address, and the same app answers with a different
 * restaurant. The preview is drawn with each store's real theme tokens and dishes.
 */
export function AddressDemo({ addresses }: { addresses: DemoAddress[] }) {
  const [selected, setSelected] = useState(0);
  const current = addresses[selected] ?? addresses[0];
  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-card bg-background shadow-[0_24px_60px_-28px_rgb(29_36_51/0.45)] ring-1 ring-foreground/10">
        <div className="flex items-center gap-2 border-b border-foreground/10 bg-muted/60 px-3 py-2.5">
          <span aria-hidden className="flex gap-1.5 pr-1">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </span>
          <p className="flex min-w-0 flex-1 items-center gap-2 rounded-control bg-background px-3 py-1.5 text-sm ring-1 ring-foreground/10">
            <Lock aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate" aria-live="polite">
              {display(current.href)}
            </span>
          </p>
          <RotateCw aria-hidden className="size-4 text-muted-foreground" />
        </div>
        {/* Keyed so each switch is a fresh element that fades in from a slight blur. */}
        <div key={current.href} className="address-swap p-3 sm:p-5">
          <StorePreview
            theme={current.store.theme}
            name={current.store.name}
            items={current.store.items}
          />
        </div>
      </div>
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm text-muted-foreground">Try an address</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {addresses.map((address, index) => (
            <label
              key={address.href}
              className="press relative shrink-0 cursor-pointer rounded-control px-3 py-2 text-sm ring-1 ring-foreground/15 has-[:checked]:bg-foreground has-[:checked]:text-background has-[:checked]:ring-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground"
            >
              <input
                type="radio"
                name="demo-address"
                checked={index === selected}
                onChange={() => setSelected(index)}
                className="sr-only"
              />
              <span className="block font-medium">{display(address.href)}</span>
              <span className="block text-xs opacity-70">{address.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <a
        href={current.href}
        className="press inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
      >
        Open {current.store.name} at this address <ArrowUpRight aria-hidden className="size-4" />
      </a>
    </div>
  );
}
