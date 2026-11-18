const GROUPS = [
  {
    title: "Brand",
    where: "Edit in the admin",
    body: "Seven colors with live contrast checks, heading and body fonts, a layout (rows, menu board or gallery), corners, a logo and a hero photo.",
  },
  {
    title: "Menu",
    where: "Edit in the admin",
    body: "Dish names, descriptions, prices and sold-out status, which reaches storefronts people already have open.",
  },
  {
    title: "Place and time",
    where: "Set per store",
    body: "Address, opening hours in the restaurant's own timezone, currency and locale, and selling units like “per ½ lb”. Shown in the admin, configured in the store's data.",
  },
];

export function Controls() {
  return (
    <section
      aria-labelledby="controls-heading"
      className="border-t border-foreground/10 py-16 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <h2
          id="controls-heading"
          className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          What each restaurant controls
        </h2>
        <dl className="grid gap-8 sm:grid-cols-3">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <dt className="font-semibold">{group.title}</dt>
              <dd className="mt-0.5 text-sm font-medium text-accent">{group.where}</dd>
              <dd className="mt-2 text-muted-foreground">{group.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
