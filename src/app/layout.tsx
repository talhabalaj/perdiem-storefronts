import type { Metadata } from "next";
import { QueryProvider } from "@/components/QueryProvider";
import { fontVariableClasses } from "@/lib/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Per Diem Storefronts",
  description: "One codebase, many branded restaurant storefronts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariableClasses} antialiased`}>
      <body className="min-h-dvh">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
