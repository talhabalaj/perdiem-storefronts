import { connection } from "next/server";
import type { AdminStore } from "@/lib/query/admin";
import { getRepository } from "@/lib/repo";

/** Admin reads bypass the storefront cache: editors always see what is in the database. */
export async function GET(_request: Request, { params }: RouteContext<"/api/admin/stores/[slug]">) {
  await connection();
  const repo = getRepository();
  const store = await repo.findStoreBySlug((await params).slug);
  if (!store) return Response.json({ error: "Store not found" }, { status: 404 });
  const body: AdminStore = { store, menu: await repo.getMenu(store.id) };
  return Response.json(body);
}
