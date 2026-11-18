import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Theme } from "@/lib/schemas";
import { LAYOUT_NAMES } from "./labels";

export interface StoreRow {
  slug: string;
  name: string;
  color: string;
  layout: Theme["layout"];
  items: number;
  soldOut: number;
  domains: string[];
}

export function StoresTable({ rows }: { rows: StoreRow[] }) {
  const th = "px-4 py-2.5 text-left text-xs font-medium text-muted-foreground";
  return (
    <div className="relative mt-8 overflow-x-auto rounded-card border border-foreground/10">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="border-b border-foreground/10 bg-muted/50">
          <tr>
            <th className={th}>Store</th>
            <th className={th}>Layout</th>
            <th className={`${th} text-right`}>Menu items</th>
            <th className={`${th} text-right`}>Sold out</th>
            <th className={th}>Custom domain</th>
            <th className={th}>
              <span className="sr-only">Manage</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {rows.map((row) => (
            <tr key={row.slug} className="transition-colors hover:bg-muted/40">
              <th scope="row" className="px-4 py-3 text-left font-medium">
                <Link
                  href={`/admin/${row.slug}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full ring-1 ring-foreground/15"
                    style={{ backgroundColor: row.color }}
                  />
                  {row.name}
                </Link>
                <span className="block pl-6 text-xs font-normal text-muted-foreground">
                  {row.slug}
                </span>
              </th>
              <td className="px-4 py-3 text-muted-foreground">{LAYOUT_NAMES[row.layout]}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.items}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.soldOut}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.domains[0] ?? "None"}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/${row.slug}`}
                  aria-label={`Manage ${row.name}`}
                  className="press inline-grid size-8 place-items-center rounded-control hover:bg-muted"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
