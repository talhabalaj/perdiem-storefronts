import type { FONT_KEYS } from "@/lib/schemas";

type FontKey = (typeof FONT_KEYS)[number];

// Plain strings, safe to import from client components (fonts.ts runs next/font).
export const FONT_CSS_VAR: Record<FontKey, string> = {
  imbue: "var(--font-imbue)",
  "familjen-grotesk": "var(--font-familjen)",
  "sofia-extra-condensed": "var(--font-sofia-extra)",
  "sofia-semi-condensed": "var(--font-sofia-semi)",
  gabarito: "var(--font-gabarito)",
  "golos-text": "var(--font-golos)",
};

export const FONT_LABELS: Record<FontKey, string> = {
  imbue: "Imbue (condensed serif)",
  "familjen-grotesk": "Familjen Grotesk (humanist sans)",
  "sofia-extra-condensed": "Sofia Sans Extra Condensed (signage)",
  "sofia-semi-condensed": "Sofia Sans Semi Condensed (sturdy sans)",
  gabarito: "Gabarito (rounded geometric)",
  "golos-text": "Golos Text (neutral sans)",
};
