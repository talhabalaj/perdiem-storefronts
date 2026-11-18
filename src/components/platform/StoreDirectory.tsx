import { AddressDemo } from "./AddressDemo";
import type { DemoAddress } from "./AddressDemo";
import { loadDirectory } from "./directory";
import type { DirectoryStore } from "./directory";

const toAddress = (
  { store, items }: DirectoryStore,
  link: { label: string; href: string },
): DemoAddress => ({
  href: link.href,
  label: `${link.label}: ${store.name}`,
  store: { name: store.name, theme: store.theme, items },
});

/** Hero demo: each store's subdomain, then each custom domain, then one path, to show all three. */
export async function DirectoryDemo() {
  const stores = await loadDirectory();
  const byKind = (label: string) =>
    stores.flatMap((entry) =>
      entry.links.filter((link) => link.label === label).map((link) => toAddress(entry, link)),
    );
  const addresses = [
    ...byKind("Subdomain"),
    ...byKind("Custom domain"),
    ...byKind("Path").slice(-1),
  ];
  return <AddressDemo addresses={addresses} />;
}
