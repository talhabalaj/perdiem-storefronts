import { StorePreview } from "@/components/theme/StorePreview";
import type { DirectoryStore } from "../directory";

const POSES = [
  "-translate-x-[58%] -rotate-6 scale-90 opacity-95",
  "z-10",
  "translate-x-[58%] rotate-6 scale-90 opacity-95",
];

/** Three restaurants' storefronts on three phones: the white-label idea in one picture. */
export function PhoneFan({ stores }: { stores: DirectoryStore[] }) {
  // Put the most distinctive layout (the menu board) in the middle.
  const ordered = [...stores].toSorted((a, b) => rank(a) - rank(b)).slice(0, 3);
  return (
    <div
      className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]"
      aria-label="Three restaurant storefronts"
    >
      {ordered.map((entry, index) => (
        <a
          key={entry.store.id}
          href={entry.links[0]?.href}
          aria-label={`Open ${entry.store.name}`}
          className={`absolute top-0 left-1/2 -ml-[6.5rem] block h-[24rem] w-[13rem] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[var(--ease-out)] motion-safe:hover:-translate-y-2 sm:-ml-[7.5rem] sm:h-[28rem] sm:w-[15rem] ${POSES[index] ?? ""}`}
        >
          <div className="h-full overflow-hidden rounded-[2.25rem] border-[7px] border-black bg-black shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
            <div className="h-full overflow-hidden rounded-[1.75rem]">
              <StorePreview
                bare
                theme={entry.store.theme}
                name={entry.store.name}
                items={entry.items}
              />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function rank({ store }: DirectoryStore): number {
  return { classic: 0, board: 1, gallery: 2 }[store.theme.layout];
}
