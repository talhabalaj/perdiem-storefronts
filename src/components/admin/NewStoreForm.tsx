"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStoreAction } from "@/app/(platform)/admin/actions";
import { slugify } from "@/lib/new-store";
import { unwrap } from "@/lib/query/admin";
import type { Theme } from "@/lib/schemas";
import { LayoutPicker, LocaleFields, TextField } from "./NewStoreFields";
import { Panel } from "./Panel";

const INITIAL = {
  name: "",
  slug: "",
  customDomain: "",
  tagline: "",
  address: "",
  timezone: "America/New_York",
  currency: "USD",
  locale: "en-US",
  layout: "classic" as Theme["layout"],
};
type FormState = typeof INITIAL;

export function NewStoreForm({
  timeZones,
  rootDomain,
}: {
  timeZones: string[];
  rootDomain: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  // The address follows the name until the owner edits it by hand.
  const [slugEdited, setSlugEdited] = useState(false);
  const set = (patch: Partial<FormState>) => setForm({ ...form, ...patch });
  const create = useMutation({
    mutationFn: () => unwrap(createStoreAction(form)),
    onSuccess: ({ slug }) => router.push(`/admin/${slug}/menu`),
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate();
      }}
    >
      <NamePanel
        form={form}
        rootDomain={rootDomain}
        onChange={set}
        onName={(name) => set(slugEdited ? { name } : { name, slug: slugify(name) })}
        onSlug={(slug) => {
          setSlugEdited(true);
          set({ slug: slug.toLowerCase() });
        }}
      />
      <Panel
        title="Branding"
        description="A starting point. Colors, fonts, logo and photos can be changed in Branding afterwards."
      >
        <LayoutPicker
          value={form.layout}
          onChange={(layout) => set({ layout })}
          name={form.name}
          currency={form.currency}
          locale={form.locale}
        />
      </Panel>
      <Panel title="Time and money">
        <LocaleFields
          timeZones={timeZones}
          timezone={form.timezone}
          currency={form.currency}
          locale={form.locale}
          onChange={set}
        />
      </Panel>
      <SubmitRow pending={create.isPending} error={create.isError ? create.error.message : null} />
    </form>
  );
}

function NamePanel({
  form,
  rootDomain,
  onChange,
  onName,
  onSlug,
}: {
  form: FormState;
  rootDomain: string;
  onChange: (patch: Partial<FormState>) => void;
  onName: (name: string) => void;
  onSlug: (slug: string) => void;
}) {
  const slug = form.slug || "your-store";
  return (
    <Panel title="Name and address">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Store name" required value={form.name} onChange={onName} />
        <TextField
          label="Address on this platform"
          required
          value={form.slug}
          hint={`Live at ${slug}.${rootDomain} and /s/${slug}. Lowercase letters, numbers and dashes.`}
          onChange={onSlug}
        />
        <TextField
          label="Custom domain"
          hint="For example order.yourcafe.com"
          value={form.customDomain}
          onChange={(customDomain) => onChange({ customDomain })}
        />
        <TextField
          label="Tagline"
          value={form.tagline}
          onChange={(tagline) => onChange({ tagline })}
        />
        <TextField
          label="Street address"
          value={form.address}
          onChange={(address) => onChange({ address })}
        />
      </div>
    </Panel>
  );
}

function SubmitRow({ pending, error }: { pending: boolean; error: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        disabled={pending}
        className="press h-11 rounded-control bg-foreground px-5 font-semibold text-background disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create store"}
      </button>
      {error ? (
        <p role="alert" className="text-sm whitespace-pre-line text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
