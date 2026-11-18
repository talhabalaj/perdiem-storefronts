import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

/** Unknown paths inside a store fall into the store segment's own (themed) not-found. */
export default function UnknownStorePath() {
  return (
    <Suspense>
      <NotFoundAtRequestTime />
    </Suspense>
  );
}

// Thrown at request time, once the layout has resolved the store, so the 404 is themed.
async function NotFoundAtRequestTime(): Promise<never> {
  await connection();
  notFound();
}
