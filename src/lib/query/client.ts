import { QueryClient, environmentManager } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      // Server-prefetched data is fresh on arrival; don't refetch it immediately on hydrate.
      queries: { staleTime: 30_000 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A fresh client per server request (no cross-request leaks), one shared client in the browser. */
export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
