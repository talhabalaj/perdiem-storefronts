/** Cache tags, so readers and the admin's invalidation always agree on the names. */
export const cacheTags = {
  stores: "stores",
  store: (slug: string) => `store:${slug}`,
  menu: (slug: string) => `menu:${slug}`,
};
