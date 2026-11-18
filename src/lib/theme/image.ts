import { imageSource } from "@/lib/schemas";

const OPTIMIZED_HOSTS = new Set(["images.unsplash.com"]);

/** True for a usable image source: an absolute URL or a /path into /public. */
export function isImageSource(src: string | null | undefined): src is string {
  return typeof src === "string" && imageSource.safeParse(src).success;
}

/**
 * next/image throws for hosts missing from images.remotePatterns. Store owners can enter any
 * URL, so anything that isn't a local file or an allow-listed host is served as-is.
 */
export function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  return OPTIMIZED_HOSTS.has(new URL(src).hostname);
}
