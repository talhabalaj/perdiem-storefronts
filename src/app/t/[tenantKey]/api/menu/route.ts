import { getMenu } from "@/lib/data";
import { resolveTenant } from "@/lib/tenant/resolve";

/** Tenant-scoped by URL: the store comes from the host/path, never from a client-sent id. */
export async function GET(_request: Request, { params }: RouteContext<"/t/[tenantKey]/api/menu">) {
  const tenant = await resolveTenant((await params).tenantKey);
  if (!tenant) return Response.json({ error: "Store not found" }, { status: 404 });
  return Response.json(await getMenu(tenant.store.id, tenant.store.slug));
}
