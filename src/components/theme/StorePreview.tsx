import { ShoppingBag } from "lucide-react";
import { isImageSource } from "@/lib/theme/image";
import type { Theme } from "@/lib/schemas";
import { themeToCssVars } from "@/lib/theme/css-vars";

export interface PreviewItem {
  name: string;
  price: string;
  imageUrl: string | null;
}

/**
 * A miniature storefront drawn with the same tokens and layout idea as the real one, so the
 * admin preview and the platform directory show exactly what a theme produces.
 */
export function StorePreview({
  theme,
  name,
  items,
  bare = false,
}: {
  theme: Theme;
  name: string;
  items: PreviewItem[];
  /** Inside a device frame: fill it, no border of its own. */
  bare?: boolean;
}) {
  return (
    <div
      data-store="preview"
      style={themeToCssVars(theme)}
      className={`overflow-hidden bg-background font-body text-foreground ${bare ? "h-full" : "rounded-card ring-1 ring-foreground/10"}`}
    >
      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-1.5">
          {/* A background image, not next/image: drafts can hold half-typed URLs mid-edit. */}
          {isImageSource(theme.logoUrl) ? (
            <span
              aria-hidden
              className="size-4.5 shrink-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${theme.logoUrl}")` }}
            />
          ) : null}
          <span className="truncate font-heading text-sm">{name}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-control bg-primary px-2 py-1 text-[0.625rem] font-semibold text-primary-foreground">
          <ShoppingBag aria-hidden className="size-3" /> 2
        </span>
      </div>
      <div className="space-y-3 p-4">
        <PreviewHeading theme={theme} name={name} />
        <PreviewHero theme={theme} />
        <PreviewMenu
          layout={theme.layout}
          items={items.slice(0, previewCount(theme.layout, bare))}
        />
      </div>
    </div>
  );
}

function PreviewHeading({ theme, name }: { theme: Theme; name: string }) {
  const styles: Record<Theme["layout"], string> = {
    classic: "text-4xl leading-[0.85]",
    board: "text-4xl leading-[0.8] font-black uppercase",
    gallery: "text-3xl leading-[0.9] font-extrabold",
  };
  return <p className={`font-heading ${styles[theme.layout]}`}>{name}</p>;
}

function PreviewMenu({ layout, items }: { layout: Theme["layout"]; items: PreviewItem[] }) {
  if (layout === "gallery") {
    return (
      <ul className="grid grid-cols-2 gap-3 text-center">
        {items.map((item) => (
          <li key={item.name} className="space-y-1">
            <div
              className="mx-auto aspect-square w-4/5 overflow-hidden rounded-full bg-muted bg-cover bg-center"
              style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
            />
            <p className="truncate text-xs font-bold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.price}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (layout === "board") {
    return (
      <ul className="border-t-4 border-foreground">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline gap-1.5 border-b border-foreground/20 py-1.5 font-heading text-sm font-extrabold uppercase"
          >
            <span className="truncate">{item.name}</span>
            <span aria-hidden className="flex-1 border-b-2 border-dotted border-foreground/40" />
            <span className="text-primary">{item.price}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="divide-y divide-foreground/10">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.price}</p>
          </div>
          <div
            className="size-9 shrink-0 rounded-card bg-muted bg-cover bg-center"
            style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

function previewCount(layout: Theme["layout"], bare: boolean): number {
  if (bare) return layout === "gallery" ? 4 : 6;
  return layout === "gallery" ? 2 : 3;
}

/** The hero photo as the layout crops it, as a CSS background so draft URLs can't crash it. */
function PreviewHero({ theme }: { theme: Theme }) {
  if (!isImageSource(theme.heroImageUrl)) return null;
  const crop =
    theme.layout === "gallery" ? "mx-auto size-24 rounded-full" : "h-20 w-full rounded-card";
  return (
    <div
      aria-hidden
      className={`${crop} bg-muted bg-cover bg-center`}
      style={{ backgroundImage: `url("${theme.heroImageUrl}")` }}
    />
  );
}
