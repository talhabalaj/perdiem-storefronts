import { notFound } from "next/navigation";

// This route exists to fail; skip instant-navigation validation for it.
export const instant = false;

/**
 * Target of the proxy's rewrite for addresses no store answers to. Calling notFound() while
 * prerendering bakes a real 404 status into this route, and renders app/not-found.tsx.
 */
export default function StoreNotFoundRoute(): never {
  notFound();
}
