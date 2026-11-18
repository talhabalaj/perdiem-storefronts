"use client";

import { FONT_KEYS, LAYOUTS, RADII } from "@/lib/schemas";
import type { Theme } from "@/lib/schemas";
import { AA_TEXT, contrastRatio } from "@/lib/theme/contrast";
import { isImageSource } from "@/lib/theme/image";
import { FONT_CSS_VAR, FONT_LABELS } from "@/lib/theme/font-tokens";
import { COLOR_KEYS, COLOR_LABELS, LAYOUT_DESCRIPTIONS, LAYOUT_NAMES } from "./labels";
import { Panel } from "./Panel";

interface FieldProps {
  draft: Theme;
  onChange: (theme: Theme) => void;
}

const select =
  "h-9 w-full rounded-control border border-foreground/50 bg-background px-2.5 text-sm";

export function ColorFields({ draft, onChange }: FieldProps) {
  return (
    <Panel title="Colors" description="Every color in the storefront comes from these seven.">
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {COLOR_KEYS.map((key) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <input
              type="color"
              value={draft.colors[key]}
              onChange={(e) =>
                onChange({ ...draft, colors: { ...draft.colors, [key]: e.target.value } })
              }
              className="size-9 shrink-0 cursor-pointer rounded-control border border-foreground/50 bg-transparent p-0.5"
            />
            <span className="flex-1">{COLOR_LABELS[key]}</span>
            <span className="font-medium text-muted-foreground tabular-nums">
              {draft.colors[key]}
            </span>
          </label>
        ))}
      </div>
      <ContrastChecks colors={draft.colors} />
    </Panel>
  );
}

/** Live WCAG checks, so a rebrand can't quietly make the menu unreadable. */
function ContrastChecks({ colors }: { colors: Theme["colors"] }) {
  const pairs = [
    { label: "Text on background", fg: colors.foreground, bg: colors.background },
    { label: "Muted text on background", fg: colors.mutedForeground, bg: colors.background },
    { label: "Text on primary", fg: colors.primaryForeground, bg: colors.primary },
  ];
  return (
    <ul className="mt-5 grid gap-2 border-t border-foreground/10 pt-4 sm:grid-cols-3">
      {pairs.map(({ label, fg, bg }) => {
        const ratio = contrastRatio(fg, bg);
        const pass = ratio >= AA_TEXT;
        return (
          <li key={label} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-control text-[0.6875rem] font-bold ring-1 ring-foreground/10"
              style={{ color: fg, backgroundColor: bg }}
            >
              Aa
            </span>
            <span className="flex-1 text-muted-foreground">{label}</span>
            <span
              className={`font-semibold tabular-nums ${pass ? "text-emerald-700" : "text-red-700"}`}
            >
              {ratio.toFixed(1)}:1 {pass ? "AA" : "Fails AA"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function TypeFields({ draft, onChange }: FieldProps) {
  const fontSelect = (role: "fontHeading" | "fontBody", label: string, sample: string) => (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={draft[role]}
        onChange={(e) => onChange({ ...draft, [role]: pick(FONT_KEYS, e.target.value) })}
        className={select}
      >
        {FONT_KEYS.map((key) => (
          <option key={key} value={key}>
            {FONT_LABELS[key]}
          </option>
        ))}
      </select>
      <span
        className="block truncate pt-1 text-2xl"
        style={{ fontFamily: FONT_CSS_VAR[draft[role]] }}
      >
        {sample}
      </span>
    </label>
  );
  return (
    <Panel title="Typography">
      <div className="grid gap-6 sm:grid-cols-2">
        {fontSelect("fontHeading", "Headings", "Weekend Brunch")}
        {fontSelect("fontBody", "Body text", "Three-day lamination")}
      </div>
    </Panel>
  );
}

export function LayoutFields({ draft, onChange }: FieldProps) {
  return (
    <Panel title="Layout and shape">
      <fieldset className="grid gap-3 sm:grid-cols-3">
        <legend className="sr-only">Layout</legend>
        {LAYOUTS.map((layout) => (
          <label
            key={layout}
            className="press relative cursor-pointer rounded-card has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground border border-foreground/15 p-3.5 has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground"
          >
            <input
              type="radio"
              name="layout"
              value={layout}
              checked={draft.layout === layout}
              onChange={() => onChange({ ...draft, layout })}
              className="sr-only"
            />
            <span className="block text-sm font-semibold">{LAYOUT_NAMES[layout]}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {LAYOUT_DESCRIPTIONS[layout]}
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium">Corners</legend>
        <div className="inline-flex rounded-control border border-foreground/15 p-0.5">
          {RADII.map((radius) => (
            <label
              key={radius}
              className="relative cursor-pointer rounded-control px-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground py-1.5 text-sm capitalize text-muted-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
            >
              <input
                type="radio"
                name="radius"
                value={radius}
                checked={draft.radius === radius}
                onChange={() => onChange({ ...draft, radius })}
                className="sr-only"
              />
              {radius}
            </label>
          ))}
        </div>
      </fieldset>
    </Panel>
  );
}

export function HeroField({ draft, onChange }: FieldProps) {
  const field = (key: "logoUrl" | "heroImageUrl", label: string) => {
    const value = draft[key] ?? "";
    const invalid = value !== "" && !isImageSource(value);
    return (
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">{label}</span>
        <input
          value={value}
          aria-invalid={invalid}
          onChange={(e) => onChange({ ...draft, [key]: e.target.value || null })}
          className={`${select} aria-[invalid=true]:border-red-600`}
        />
        {invalid ? (
          <span className="block text-xs text-red-700">
            Enter a full URL, or a path starting with /
          </span>
        ) : null}
      </label>
    );
  };
  return (
    <Panel
      title="Logo and hero photo"
      description="A URL, or a path to a file in /public such as /logos/luna.png."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field("logoUrl", "Logo")}
        {field("heroImageUrl", "Hero photo")}
      </div>
    </Panel>
  );
}

/** Narrows a <select> value back to its union without a cast. */
function pick<const T extends readonly string[]>(options: T, value: string): T[number] {
  const match = options.find((option) => option === value);
  if (match === undefined) throw new Error(`Unexpected option ${value}`);
  return match;
}
