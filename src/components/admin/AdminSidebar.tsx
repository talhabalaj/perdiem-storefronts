import { listStores } from "@/lib/data";
import { SidebarNav } from "./SidebarNav";

export async function AdminSidebar() {
  const stores = await listStores();
  return (
    <SidebarNav
      stores={stores.map((store) => ({
        slug: store.slug,
        name: store.name,
        color: store.theme.colors.primary,
      }))}
    />
  );
}
