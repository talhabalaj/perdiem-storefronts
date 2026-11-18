"use client";

import { StorePreview } from "@/components/theme/StorePreview";
import { formatMoney } from "@/lib/money";
import { CURRENCIES, LOCALES } from "@/lib/new-store";
import { LAYOUTS } from "@/lib/schemas";
import type { Theme } from "@/lib/schemas";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { LAYOUT_NAMES } from "./labels";

export const field =
  "h-10 w-full rounded-control border border-foreground/50 bg-background px-3 text-sm";

export function TextField({
  label,
  hint,
  value,
  onChange,
  required = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">
        {label}
        {required ? null : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={field}
      />
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function LayoutPicker({
  value,
  onChange,
  name,
  currency,
  locale,
}: {
  value: Theme["layout"];
  onChange: (layout: Theme["layout"]) => void;
  name: string;
  currency: string;
  locale: string;
}) {
  const sample = ["House special", "Seasonal plate", "Something sweet"].map((dish, i) => ({
    name: dish,
    price: formatMoney(1200 - i * 350, currency, locale),
    imageUrl: null,
  }));
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-medium">Look and layout</legend>
      <div className="grid gap-4 sm:grid-cols-3">
        {LAYOUTS.map((layout) => (
          <label
            key={layout}
            className="press relative block cursor-pointer space-y-2 rounded-card p-1 has-[:checked]:ring-2 has-[:checked]:ring-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground"
          >
            <input
              type="radio"
              name="layout"
              value={layout}
              checked={value === layout}
              onChange={() => onChange(layout)}
              className="sr-only"
            />
            <StorePreview
              theme={THEME_PRESETS[layout]}
              name={name || "Your store"}
              items={sample}
            />
            <span className="block px-1 pb-1 text-sm font-semibold">{LAYOUT_NAMES[layout]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LocaleFields({
  timeZones,
  timezone,
  currency,
  locale,
  onChange,
}: {
  timeZones: string[];
  timezone: string;
  currency: string;
  locale: string;
  onChange: (patch: { timezone?: string; currency?: string; locale?: string }) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Timezone</span>
        <select
          value={timezone}
          onChange={(e) => onChange({ timezone: e.target.value })}
          className={field}
        >
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Currency</span>
        <select
          value={currency}
          onChange={(e) => onChange({ currency: e.target.value })}
          className={field}
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Number and date format</span>
        <select
          value={locale}
          onChange={(e) => onChange({ locale: e.target.value })}
          className={field}
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
