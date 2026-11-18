"use client";

import { useEffect, useRef, useState } from "react";
import { useMenu } from "./useMenu";

export const categoryAnchor = (id: number) => `category-${id}`;
const SPY_OFFSET = 140;

/** Sticky category chips that follow your scroll position (scroll-spy). */
export function CategoryNav({ className = "" }: { className?: string }) {
  const menu = useMenu();
  const [active, setActive] = useState(menu[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // The section under the sticky header + nav (~130px) is current; before the first one, the first.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(menu.at(-1)?.id);
        return;
      }
      const current = menu.findLast((category) => {
        const el = document.getElementById(categoryAnchor(category.id));
        return el !== null && el.getBoundingClientRect().top <= SPY_OFFSET;
      });
      setActive(current?.id ?? menu[0]?.id);
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [menu]);

  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (strip && chip) {
      strip.scrollTo({ left: chip.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [active]);

  return (
    <nav aria-label="Menu sections" className={className}>
      <div
        ref={stripRef}
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none]"
      >
        {menu.map((category) => (
          <a
            key={category.id}
            href={`#${categoryAnchor(category.id)}`}
            data-chip={category.id}
            aria-current={category.id === active ? "true" : undefined}
            className="press shrink-0 rounded-control px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current]:bg-foreground aria-[current]:text-background"
          >
            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
