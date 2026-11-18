import type { ReactNode } from "react";
import { OrderBar } from "@/components/cart/OrderBar";
import { OrderSheetProvider } from "@/components/cart/OrderSheetContext";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuGate } from "@/components/menu/MenuGate";
import type { Store } from "@/lib/schemas";
import { StoreFooter } from "./StoreFooter";
import { StoreHeader } from "./StoreHeader";

/** The frame every layout shares; a layout only decides the hero and how the menu is set. */
export function Storefront({
  store,
  basePath,
  hero,
  menu,
}: {
  store: Store;
  basePath: string;
  hero: ReactNode;
  menu: ReactNode;
}) {
  return (
    <OrderSheetProvider>
      <StoreHeader name={store.name} basePath={basePath} logoUrl={store.theme.logoUrl} />
      <main>
        {hero}
        <MenuGate storeName={store.name}>
          <div className="sticky top-14 z-10 border-b border-foreground/10 bg-background/95 backdrop-blur-md">
            <CategoryNav className="mx-auto max-w-6xl px-4" />
          </div>
          <div className="mx-auto max-w-6xl px-4 pt-10">{menu}</div>
        </MenuGate>
      </main>
      <StoreFooter store={store} />
      <OrderBar />
    </OrderSheetProvider>
  );
}
