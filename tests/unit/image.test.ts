import { describe, expect, it } from "vite-plus/test";
import { isImageSource, isOptimizable } from "@/lib/theme/image";

describe("image sources", () => {
  it("accepts absolute URLs and /public paths, rejects half-typed input", () => {
    expect(isImageSource("https://images.unsplash.com/photo-1?w=800")).toBe(true);
    expect(isImageSource("/logos/luna.png")).toBe(true);
    for (const bad of ["h", "htt", "logos/luna.png", "", null, undefined]) {
      expect(isImageSource(bad)).toBe(false);
    }
  });

  it("only optimizes local files and allow-listed hosts", () => {
    expect(isOptimizable("/logos/luna.png")).toBe(true);
    expect(isOptimizable("https://images.unsplash.com/photo-1")).toBe(true);
    expect(isOptimizable("https://example.com/logo.png")).toBe(false);
  });
});
