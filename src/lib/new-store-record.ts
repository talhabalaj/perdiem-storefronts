import type { NewStore } from "@/lib/new-store";
import type { NewStoreRecord } from "@/lib/repo/types";
import type { Hours } from "@/lib/schemas";
import { THEME_PRESETS } from "@/lib/theme/presets";

/** Open every day 09:00–21:00 until the owner sets real hours. */
const DEFAULT_HOURS: Hours = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
  day,
  open: "09:00",
  close: "21:00",
}));

/** Everything a store needs to go live, from the few fields the admin form asks for. */
export function toNewStoreRecord(input: NewStore): NewStoreRecord {
  return {
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    address: input.address,
    phone: "",
    timezone: input.timezone,
    currency: input.currency,
    locale: input.locale,
    theme: THEME_PRESETS[input.layout],
    hours: DEFAULT_HOURS,
    seo: {
      title: `${input.name}: order online`,
      description: input.tagline || `Order pickup from ${input.name}.`,
    },
    customDomain: input.customDomain,
  };
}

/** A custom domain under the platform's own domain would be parsed as a subdomain instead. */
export function isPlatformDomain(domain: string, rootDomain: string): boolean {
  return domain === rootDomain || domain.endsWith(`.${rootDomain}`);
}
