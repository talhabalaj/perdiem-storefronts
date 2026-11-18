import type { CSSProperties } from "react";
import type { Theme } from "@/lib/schemas";
import { FONT_CSS_VAR } from "./font-tokens";

// Lets `style` carry CSS custom properties (the theme tokens) without a type assertion.
declare module "react" {
  interface CSSProperties extends Partial<Record<`--${string}`, string | number>> {}
}

const RADIUS: Record<Theme["radius"], { card: string; control: string }> = {
  none: { card: "0", control: "0" },
  sm: { card: "0.375rem", control: "0.25rem" },
  md: { card: "0.75rem", control: "0.5rem" },
  lg: { card: "1.25rem", control: "0.75rem" },
  full: { card: "1.75rem", control: "9999px" },
};

/** Maps a store theme onto the CSS custom properties that globals.css exposes to Tailwind. */
export function themeToCssVars(theme: Theme): CSSProperties {
  const { colors } = theme;
  const radius = RADIUS[theme.radius];
  return {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--radius-card": radius.card,
    "--radius-control": radius.control,
    "--font-heading-family": FONT_CSS_VAR[theme.fontHeading],
    "--font-body-family": FONT_CSS_VAR[theme.fontBody],
  };
}
