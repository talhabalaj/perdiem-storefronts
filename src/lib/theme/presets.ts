import type { Theme } from "@/lib/schemas";

/**
 * Starting points for a new store, one per layout. Each passes WCAG AA for its text pairs
 * (tested); the owner refines it in the branding editor afterwards.
 */
export const THEME_PRESETS: Record<Theme["layout"], Theme> = {
  classic: {
    colors: {
      primary: "#1f5f73",
      primaryForeground: "#f2f8fa",
      background: "#eef3f5",
      foreground: "#13232b",
      muted: "#dde8ec",
      mutedForeground: "#4b616b",
      accent: "#e0a43a",
    },
    radius: "md",
    fontHeading: "imbue",
    fontBody: "familjen-grotesk",
    layout: "classic",
    logoUrl: null,
    heroImageUrl: null,
  },
  board: {
    colors: {
      primary: "#7a3b12",
      primaryForeground: "#fbf1e6",
      background: "#f1e4d6",
      foreground: "#24170f",
      muted: "#e4d0bd",
      mutedForeground: "#5d4635",
      accent: "#c98a12",
    },
    radius: "none",
    fontHeading: "sofia-extra-condensed",
    fontBody: "sofia-semi-condensed",
    layout: "board",
    logoUrl: null,
    heroImageUrl: null,
  },
  gallery: {
    colors: {
      primary: "#5b3c9e",
      primaryForeground: "#f7f4fd",
      background: "#f2f0f7",
      foreground: "#1e1530",
      muted: "#e3def0",
      mutedForeground: "#554a6b",
      accent: "#d9577a",
    },
    radius: "full",
    fontHeading: "gabarito",
    fontBody: "golos-text",
    layout: "gallery",
    logoUrl: null,
    heroImageUrl: null,
  },
};
