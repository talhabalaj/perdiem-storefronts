"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { addMenuItemAction } from "@/app/(platform)/admin/actions";
import { adminStoreKey, unwrap } from "@/lib/query/admin";
import { Panel } from "./Panel";

const EMPTY = { section: "", name: "", description: "", price: "" };
type DishDraft = typeof EMPTY;
const input = "h-10 w-full rounded-control border border-foreground/50 bg-background px-3 text-sm";

/** Adds a dish to an existing section, or to a new one when the section name is new. */
export function AddDishForm({
  slug,
  sections,
  currency,
}: {
  slug: string;
  sections: string[];
  currency: string;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DishDraft>({ ...EMPTY, section: sections[0] ?? "" });
  const priceCents = Math.round(Number(form.price) * 100);
  const add = useMutation({
    mutationFn: () => unwrap(addMenuItemAction(slug, { ...form, priceCents })),
    onSuccess: async () => {
      setForm({ ...EMPTY, section: form.section });
      await queryClient.invalidateQueries({ queryKey: adminStoreKey(slug) });
    },
  });

  return (
    <Panel
      title="Add a dish"
      description="Pick a section or type a new one. It shows on the storefront straight away."
    >
      <form
        className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          add.mutate();
        }}
      >
        <DishFields
          form={form}
          sections={sections}
          currency={currency}
          onChange={(patch) => setForm({ ...form, ...patch })}
        />
        <button
          type="submit"
          disabled={add.isPending || !Number.isFinite(priceCents)}
          className="press inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-50 sm:row-start-1 sm:col-start-4"
        >
          <Plus aria-hidden className="size-4" /> Add dish
        </button>
        {add.isError ? (
          <p role="alert" className="text-sm whitespace-pre-line text-red-700 sm:col-span-4">
            {add.error.message}
          </p>
        ) : null}
      </form>
    </Panel>
  );
}

function DishFields({
  form,
  sections,
  currency,
  onChange,
}: {
  form: DishDraft;
  sections: string[];
  currency: string;
  onChange: (patch: Partial<DishDraft>) => void;
}) {
  return (
    <>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Section</span>
        <input
          list="menu-sections"
          required
          value={form.section}
          onChange={(e) => onChange({ section: e.target.value })}
          className={input}
        />
        <datalist id="menu-sections">
          {sections.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </datalist>
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Dish name</span>
        <input
          required
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={input}
        />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Price ({currency})</span>
        <input
          required
          inputMode="decimal"
          value={form.price}
          onChange={(e) => onChange({ price: e.target.value })}
          className={`${input} text-right tabular-nums`}
        />
      </label>
      <label className="block space-y-1.5 text-sm sm:col-span-4">
        <span className="font-medium">
          Description <span className="font-normal text-muted-foreground">(optional)</span>
        </span>
        <input
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={input}
        />
      </label>
    </>
  );
}
