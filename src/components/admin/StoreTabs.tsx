"use client";

import { LayoutDashboard, Palette, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StoreTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/admin/${slug}`;
  const tabs = [
    { href: base, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/branding`, label: "Branding", icon: Palette },
    { href: `${base}/menu`, label: "Menu", icon: UtensilsCrossed },
  ];
  return (
    <nav
      aria-label="Store sections"
      className="-mb-px mt-6 flex gap-1 overflow-x-auto [scrollbar-width:none]"
    >
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className="inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current]:border-foreground aria-[current]:text-foreground"
        >
          <Icon aria-hidden className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
