"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";

// On an unknown host, "/" is that same unknown host, so links home need the platform's origin.
const PlatformHomeContext = createContext("/");

export function PlatformHomeProvider({ href, children }: { href: string; children: ReactNode }) {
  return <PlatformHomeContext value={href}>{children}</PlatformHomeContext>;
}

export function usePlatformHome(): string {
  return use(PlatformHomeContext);
}
