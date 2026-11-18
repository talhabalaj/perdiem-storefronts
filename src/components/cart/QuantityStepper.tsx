"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

/** − n + control. Shared by menu items and order rows so both behave identically. */
export function QuantityStepper({
  name,
  quantity,
  onChange,
  focusPlus = false,
}: {
  name: string;
  quantity: number;
  onChange: (quantity: number) => void;
  /** Move keyboard focus to "+" when this stepper replaces the Add button that had it. */
  focusPlus?: boolean;
}) {
  const plusRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (focusPlus) plusRef.current?.focus();
  }, [focusPlus]);
  const step = "press grid size-11 place-items-center rounded-control hover:bg-muted sm:size-9";
  return (
    <fieldset
      aria-label={`${name} quantity`}
      className="m-0 inline-flex min-w-0 items-center rounded-control border-0 bg-background p-0 ring-1 ring-foreground/25 ring-inset"
    >
      <button
        type="button"
        aria-label={quantity === 1 ? `Remove ${name}` : `One less ${name}`}
        onClick={() => onChange(quantity - 1)}
        className={step}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums">{quantity}</span>
      <button
        ref={plusRef}
        type="button"
        aria-label={`One more ${name}`}
        onClick={() => onChange(quantity + 1)}
        className={step}
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </fieldset>
  );
}
