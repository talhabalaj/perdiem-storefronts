import {
  Familjen_Grotesk,
  Gabarito,
  Golos_Text,
  Imbue,
  Sofia_Sans_Extra_Condensed,
  Sofia_Sans_Semi_Condensed,
} from "next/font/google";

// next/font resolves fonts at build time (options must be literals), so stores choose from this
// curated set rather than arbitrary names. Only the platform face is preloaded: every face is
// declared on <html>, and the browser downloads just the ones the current store uses.
const imbue = Imbue({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-imbue",
});
const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-familjen",
});
const sofiaExtra = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sofia-extra",
});
const sofiaSemi = Sofia_Sans_Semi_Condensed({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sofia-semi",
});
const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-gabarito",
});
const golos = Golos_Text({ subsets: ["latin"], display: "swap", variable: "--font-golos" });

export const fontVariableClasses = [imbue, familjen, sofiaExtra, sofiaSemi, gabarito, golos]
  .map((font) => font.variable)
  .join(" ");
