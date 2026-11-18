"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { menuQuery } from "@/lib/query/menu";
import { useStore } from "@/components/storefront/StoreContext";

export function useMenu() {
  const { slug, basePath } = useStore();
  return useSuspenseQuery(menuQuery(slug, basePath)).data;
}
