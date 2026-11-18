/** Public URLs a store is reachable at, given the platform's root domain and current port. */
export function storeUrls(
  store: { slug: string; customDomains: string[] },
  request: { host: string | null; proto: string | null },
): { label: string; href: string }[] {
  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost";
  const port = request.host?.split(":")[1];
  const origin = (host: string) => `${request.proto ?? "http"}://${host}${port ? `:${port}` : ""}`;
  return [
    { label: "Subdomain", href: origin(`${store.slug}.${rootDomain}`) },
    ...store.customDomains.map((domain) => ({ label: "Custom domain", href: origin(domain) })),
    { label: "Path", href: `/s/${store.slug}` },
  ];
}

/** The platform's own origin (store directory), e.g. http://localhost:3000. */
export function platformUrl(request: { host: string | null; proto: string | null }): string {
  const rootDomain = process.env.ROOT_DOMAIN ?? "localhost";
  const port = request.host?.split(":")[1];
  return `${request.proto ?? "http"}://${rootDomain}${port ? `:${port}` : ""}/`;
}
