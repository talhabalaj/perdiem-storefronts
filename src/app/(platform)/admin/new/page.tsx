import { NewStoreForm } from "@/components/admin/NewStoreForm";

export default function NewStorePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">New store</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It goes live as soon as you create it. Branding and menu can be changed afterwards.
      </p>
      {/* Server-provided list, so the options can't differ between server and browser. */}
      <NewStoreForm
        timeZones={Intl.supportedValuesOf("timeZone")}
        rootDomain={process.env.ROOT_DOMAIN ?? "localhost"}
      />
    </main>
  );
}
