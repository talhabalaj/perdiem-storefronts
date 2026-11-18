import { describe, expect, it } from "vite-plus/test";
import { contrastRatio } from "@/lib/theme/contrast";
import { SEED_STORES } from "@/db/seed";

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  });

  it("every seeded store's text pairs pass AA", () => {
    for (const { slug, theme } of SEED_STORES) {
      const c = theme.colors;
      for (const [fg, bg] of [
        [c.foreground, c.background],
        [c.mutedForeground, c.background],
        [c.primaryForeground, c.primary],
      ] as const) {
        expect(contrastRatio(fg, bg), `${slug} ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
