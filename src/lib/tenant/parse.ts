/**
 * Pure request -> tenant parsing. No I/O, so it can run in the proxy and be unit tested
 * exhaustively. Whether the tenant actually exists is decided later, in resolve.ts.
 */
export type TenantRoute =
  | { kind: "platform" }
  | { kind: "subdomain"; slug: string }
  | { kind: "domain"; hostname: string }
  | { kind: "path"; slug: string; rest: string };

export interface ParseInput {
  host: string | null;
  pathname: string;
  rootDomain: string;
}

/** Subdomains of the root domain that belong to the platform, never to a store. */
const RESERVED_SUBDOMAINS = new Set(["www", "admin", "app", "api"]);
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "[::1]", "0.0.0.0"]);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PATH_TENANT = /^\/s\/([^/]+)(\/.*)?$/;

export function normalizeHost(host: string | null): string {
  if (!host) return "";
  const lower = host.trim().toLowerCase();
  // Keep IPv6 brackets, drop the port, drop a trailing FQDN dot.
  const withoutPort = lower.startsWith("[") ? lower.replace(/\]:\d+$/, "]") : lower.split(":")[0];
  return (withoutPort ?? "").replace(/\.$/, "");
}

export function parseStoreRequest({ host, pathname, rootDomain }: ParseInput): TenantRoute {
  const hostname = normalizeHost(host);
  const root = normalizeHost(rootDomain);

  if (hostname === "" || hostname === root || LOOPBACK_HOSTS.has(hostname)) {
    return parsePlatformPath(pathname);
  }

  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -(root.length + 1));
    if (RESERVED_SUBDOMAINS.has(sub)) return parsePlatformPath(pathname);
    // Single-label, slug-shaped subdomains are stores; anything else (a.b.root) can only
    // match as an explicitly registered custom domain.
    if (SLUG.test(sub)) return { kind: "subdomain", slug: sub };
  }

  return { kind: "domain", hostname };
}

function parsePlatformPath(pathname: string): TenantRoute {
  const match = PATH_TENANT.exec(pathname);
  const slug = match?.[1]?.toLowerCase();
  if (!slug || !SLUG.test(slug)) return { kind: "platform" };
  return { kind: "path", slug, rest: match?.[2] ?? "" };
}

/**
 * Tenant routes are carried to the app as one URL segment (/t/<key>/...), e.g.
 * "sub~luna", "dom~order.lunacafe.test", "path~luna". `~` is URL-safe and never in a slug.
 */
export type TenantKey =
  | { mode: "sub"; slug: string }
  | { mode: "path"; slug: string }
  | { mode: "dom"; hostname: string };

export function toTenantKey(route: Exclude<TenantRoute, { kind: "platform" }>): string {
  if (route.kind === "domain") return `dom~${route.hostname}`;
  return `${route.kind === "subdomain" ? "sub" : "path"}~${route.slug}`;
}

export function parseTenantKey(raw: string): TenantKey | null {
  const decoded = decodeURIComponent(raw);
  const sep = decoded.indexOf("~");
  const mode = decoded.slice(0, sep);
  const value = decoded.slice(sep + 1);
  if (sep < 1 || value === "") return null;
  if ((mode === "sub" || mode === "path") && SLUG.test(value)) return { mode, slug: value };
  if (mode === "dom") return { mode, hostname: value };
  return null;
}
