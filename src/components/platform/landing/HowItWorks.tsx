const STEPS = [
  {
    title: "Read the address",
    example: "luna.localhost",
    body: "A subdomain, a custom domain like order.lunacafe.test, or a path like /s/luna. The proxy turns it into a store key without touching the database.",
  },
  {
    title: "Find the store",
    example: "Luna Café",
    body: "The key is looked up once and cached per store. An address that matches nothing gets a clear not-found page, never another restaurant's menu.",
  },
  {
    title: "Render its brand",
    example: "Indigo, Imbue, rows",
    body: "The store's theme becomes CSS variables, its layout chooses the page structure, and its menu arrives already in the HTML.",
  },
];

/** A real sequence (request to page), so the steps are numbered. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="border-t border-foreground/10 py-16 md:py-24">
      <h2
        id="how-heading"
        className="max-w-xl text-3xl font-semibold tracking-tight text-balance md:text-4xl"
      >
        How a request finds its restaurant
      </h2>
      <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t-2 border-foreground pt-5">
            <p className="text-sm font-semibold text-muted-foreground tabular-nums">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm font-medium text-accent">{step.example}</p>
            <p className="mt-3 text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
