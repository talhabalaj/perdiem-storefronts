import type { ReactNode } from "react";

/** A titled section of the dashboard: hairline border, no shadow, optional header action. */
export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-foreground/10 bg-background">
      <header className="flex items-start justify-between gap-4 border-b border-foreground/10 px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
