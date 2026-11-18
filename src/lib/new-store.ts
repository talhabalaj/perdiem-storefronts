import { z } from "zod";
import { LAYOUTS, isValidTimeZone, slugSchema } from "@/lib/schemas";

/** Subdomains the platform keeps for itself, plus the internal route prefixes. */
export const RESERVED_SLUGS = new Set([
  "www",
  "admin",
  "app",
  "api",
  "s",
  "t",
  "static",
  "assets",
  "logos",
]);

/** Prices are stored in minor units with two decimals, so only two-decimal currencies. */
export const CURRENCIES = ["USD", "CAD", "GBP", "EUR", "AUD", "NZD", "CHF", "SGD"] as const;
export const LOCALES = ["en-US", "en-GB", "en-CA", "en-AU", "fr-FR", "de-DE"] as const;

const HOSTNAME = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

const optionalText = (max: number) => z.string().trim().max(max).default("");

export const NewStoreSchema = z.object({
  name: z.string().trim().min(2, "Give the store a name").max(60),
  slug: slugSchema
    .min(2, "At least 2 characters")
    .max(40, "At most 40 characters")
    .refine((slug) => !RESERVED_SLUGS.has(slug), "That address is reserved by the platform"),
  customDomain: z
    .string()
    .trim()
    .toLowerCase()
    .default("")
    .refine(
      (value) => value === "" || HOSTNAME.test(value),
      "Enter a domain like order.example.com",
    )
    .transform((value) => (value === "" ? null : value)),
  tagline: optionalText(120),
  address: optionalText(160),
  timezone: z.string().refine(isValidTimeZone, "Pick a timezone from the list"),
  currency: z.enum(CURRENCIES),
  locale: z.enum(LOCALES),
  layout: z.enum(LAYOUTS),
});

export type NewStore = z.infer<typeof NewStoreSchema>;

export const NewMenuItemSchema = z.object({
  section: z.string().trim().min(1, "Name the menu section").max(40),
  name: z.string().trim().min(1, "Name the dish").max(80),
  description: optionalText(300),
  priceCents: z.number().int().nonnegative().max(1_000_000),
});

export type NewMenuItem = z.infer<typeof NewMenuItemSchema>;

/** A suggested address from a store name: "Corner Deli & Co." -> "corner-deli-co". */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}
