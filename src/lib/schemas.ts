import { z } from "zod";

export const FONT_KEYS = [
  "imbue",
  "familjen-grotesk",
  "sofia-extra-condensed",
  "sofia-semi-condensed",
  "gabarito",
  "golos-text",
] as const;
/** classic: menu rows with thumbnails · board: menu board with leaders · gallery: round photo grid */
export const LAYOUTS = ["classic", "board", "gallery"] as const;
export const RADII = ["none", "sm", "md", "lg", "full"] as const;

const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, "Expected a 6-digit hex color like #1a2b3c");
/** An absolute URL or a same-origin path to a file in /public (e.g. "/logos/luna.png"). */
export const imageSource = z.union([
  z.url(),
  z.string().regex(/^\/[\w./-]+$/, "Expected a URL or a /path"),
]);
const clockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected 24h time like 09:30");
const TIME_ZONES = new Set(Intl.supportedValuesOf("timeZone"));
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected a lowercase slug like green-bowl");

export const ThemeSchema = z.object({
  colors: z.object({
    primary: hexColor,
    primaryForeground: hexColor,
    background: hexColor,
    foreground: hexColor,
    muted: hexColor,
    mutedForeground: hexColor,
    accent: hexColor,
  }),
  radius: z.enum(RADII),
  fontHeading: z.enum(FONT_KEYS),
  fontBody: z.enum(FONT_KEYS),
  layout: z.enum(LAYOUTS),
  logoUrl: imageSource.nullable(),
  heroImageUrl: imageSource.nullable(),
});

/** Weekly opening hours. `day` is 0 (Sunday) to 6. A close time <= open time spans midnight. */
export const HoursSchema = z.array(
  z.object({ day: z.number().int().min(0).max(6), open: clockTime, close: clockTime }),
);

export const SeoSchema = z.object({ title: z.string().min(1), description: z.string().min(1) });

export const MenuItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(80),
  description: z.string().max(300),
  priceCents: z.number().int().nonnegative(),
  /** What the price buys, when it isn't simply "one": "½ lb", "½ rack". */
  unit: z.string().max(24).nullable().default(null),
  imageUrl: z.url().nullable(),
  soldOut: z.boolean(),
});

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  items: z.array(MenuItemSchema),
});

export const StoreSchema = z.object({
  id: z.number().int().positive(),
  slug: slugSchema,
  name: z.string().min(1),
  tagline: z.string(),
  address: z.string(),
  phone: z.string(),
  timezone: z.string().refine(isValidTimeZone, "Unknown IANA timezone"),
  currency: z.string().length(3),
  locale: z.string().min(2),
  theme: ThemeSchema,
  hours: HoursSchema,
  seo: SeoSchema,
});

/** Shape of a seed file: a store plus its menu and custom domains, before ids exist. */
export const SeedStoreSchema = StoreSchema.omit({ id: true }).extend({
  customDomains: z.array(z.string().min(3)),
  menu: z.array(
    z.object({
      name: z.string().min(1),
      items: z.array(MenuItemSchema.omit({ id: true })),
    }),
  ),
});

export const MenuItemPatchSchema = MenuItemSchema.pick({
  name: true,
  description: true,
  priceCents: true,
  soldOut: true,
}).partial();

export type Theme = z.infer<typeof ThemeSchema>;
export type Hours = z.infer<typeof HoursSchema>;
export type Seo = z.infer<typeof SeoSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Store = z.infer<typeof StoreSchema>;
export type SeedStore = z.infer<typeof SeedStoreSchema>;
export type MenuItemPatch = z.infer<typeof MenuItemPatchSchema>;
export type StoreSummary = Pick<Store, "id" | "slug" | "name" | "tagline" | "theme"> & {
  customDomains: string[];
};

export function isValidTimeZone(tz: string): boolean {
  return TIME_ZONES.has(tz);
}
