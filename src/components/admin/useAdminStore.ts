"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { adminStoreQuery } from "@/lib/query/admin";

/** The store being edited, from the URL, kept in the React Query cache the layout seeded. */
export function useAdminStore() {
  const { slug } = useParams<{ slug: string }>();
  return { slug, ...useSuspenseQuery(adminStoreQuery(slug)).data };
}
