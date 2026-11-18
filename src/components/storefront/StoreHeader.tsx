import Image from "next/image";
import Link from "next/link";
import { OrderButton } from "@/components/cart/OrderButton";
import { isImageSource, isOptimizable } from "@/lib/theme/image";

export function StoreHeader({
  name,
  basePath,
  logoUrl,
}: {
  name: string;
  basePath: string;
  logoUrl: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href={basePath || "/"}
          className="flex min-w-0 items-center gap-2.5 font-heading text-xl leading-none"
        >
          {isImageSource(logoUrl) ? (
            <Image
              src={logoUrl}
              alt=""
              width={32}
              height={32}
              unoptimized={!isOptimizable(logoUrl)}
              className="size-8 shrink-0"
            />
          ) : null}
          <span className="truncate">{name}</span>
        </Link>
        <OrderButton />
      </div>
    </header>
  );
}
