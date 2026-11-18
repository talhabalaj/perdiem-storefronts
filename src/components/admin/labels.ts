import type { Theme } from "@/lib/schemas";

export const LAYOUT_NAMES: Record<Theme["layout"], string> = {
  classic: "Rows",
  board: "Menu board",
  gallery: "Gallery",
};

export const LAYOUT_DESCRIPTIONS: Record<Theme["layout"], string> = {
  classic: "A photo beside each dish. Dense and quick to scan.",
  board: "Text-only board with dotted leaders, like a pit menu.",
  gallery: "Round dish photos in a grid. The food leads.",
};

export const COLOR_KEYS = [
  "primary",
  "primaryForeground",
  "background",
  "foreground",
  "muted",
  "mutedForeground",
  "accent",
] as const satisfies readonly (keyof Theme["colors"])[];

export const COLOR_LABELS: Record<keyof Theme["colors"], string> = {
  primary: "Primary",
  primaryForeground: "Text on primary",
  background: "Background",
  foreground: "Text",
  muted: "Surface",
  mutedForeground: "Muted text",
  accent: "Accent",
};
