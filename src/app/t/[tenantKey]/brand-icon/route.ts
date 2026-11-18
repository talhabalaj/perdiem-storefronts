import { resolveTenant } from "@/lib/tenant/resolve";

/** Per-store favicon: the store's initial on its brand color, generated from the theme. */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/t/[tenantKey]/brand-icon">,
) {
  const tenant = await resolveTenant((await params).tenantKey);
  if (!tenant) return new Response("Not found", { status: 404 });
  const { name, theme } = tenant.store;
  const initial = escapeXml(name.trim().charAt(0).toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="${theme.colors.primary}"/>
<text x="32" y="44" font-family="system-ui,sans-serif" font-size="36" font-weight="700" text-anchor="middle" fill="${theme.colors.primaryForeground}">${initial}</text>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=300" },
  });
}

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}
