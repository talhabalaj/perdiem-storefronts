import { describe, expect, it } from "vite-plus/test";
import { NewStoreSchema, slugify } from "@/lib/new-store";
import { isPlatformDomain, toNewStoreRecord } from "@/lib/new-store-record";
import { contrastRatio } from "@/lib/theme/contrast";
import { THEME_PRESETS } from "@/lib/theme/presets";

const valid = {
  name: "Corner Deli",
  slug: "corner-deli",
  customDomain: "",
  timezone: "Europe/Dublin",
  currency: "EUR",
  locale: "en-GB",
  layout: "gallery",
};

const errorFor = (patch: Record<string, unknown>) => {
  const result = NewStoreSchema.safeParse({ ...valid, ...patch });
  return result.success ? null : result.error.issues[0]?.message;
};

describe("NewStoreSchema", () => {
  it("accepts a minimal store and normalizes optional fields", () => {
    const parsed = NewStoreSchema.parse({ ...valid, customDomain: "  Order.CornerDeli.IE " });
    expect(parsed.customDomain).toBe("order.cornerdeli.ie");
    expect(parsed.tagline).toBe("");
    expect(NewStoreSchema.parse(valid).customDomain).toBeNull();
  });

  it("rejects addresses that can't be a subdomain, or that the platform reserves", () => {
    expect(errorFor({ slug: "Corner Deli" })).toMatch(/lowercase slug/);
    expect(errorFor({ slug: "-deli" })).toMatch(/lowercase slug/);
    expect(errorFor({ slug: "a" })).toMatch(/At least 2/);
    expect(errorFor({ slug: "admin" })).toMatch(/reserved/);
    expect(errorFor({ slug: "www" })).toMatch(/reserved/);
  });

  it("rejects malformed domains, unknown timezones and unsupported currencies", () => {
    expect(errorFor({ customDomain: "localhost" })).toMatch(/domain like/);
    expect(errorFor({ customDomain: "not a domain" })).toMatch(/domain like/);
    expect(errorFor({ timezone: "Mars/Olympus" })).toMatch(/timezone/);
    // Prices are stored with two decimals, so zero-decimal currencies are not offered.
    expect(errorFor({ currency: "JPY" })).not.toBeNull();
  });
});

describe("new store helpers", () => {
  it("suggests a subdomain-safe address from a name", () => {
    expect(slugify("Corner Deli & Co.")).toBe("corner-deli-co");
    expect(slugify("  Café Olé  ")).toBe("cafe-ole");
  });

  it("builds a complete, live-ready record from the form", () => {
    const record = toNewStoreRecord(NewStoreSchema.parse(valid));
    expect(record.theme).toEqual(THEME_PRESETS.gallery);
    expect(record.hours).toHaveLength(7);
    expect(record.seo.title).toContain("Corner Deli");
  });

  it("keeps custom domains off the platform's own domain", () => {
    expect(isPlatformDomain("luna.localhost", "localhost")).toBe(true);
    expect(isPlatformDomain("order.cornerdeli.ie", "localhost")).toBe(false);
  });

  it("every preset's text pairs pass WCAG AA", () => {
    for (const [layout, { colors }] of Object.entries(THEME_PRESETS)) {
      for (const [fg, bg] of [
        [colors.foreground, colors.background],
        [colors.mutedForeground, colors.background],
        [colors.primaryForeground, colors.primary],
      ] as const) {
        expect(contrastRatio(fg, bg), `${layout} ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
