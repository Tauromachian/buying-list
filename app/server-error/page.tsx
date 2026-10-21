import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Something went wrong",
};

/**
 * Landing page for API server errors (5xx).
 *
 * Since the data is fetched from client components, the `error.tsx`
 * boundary never fires for failed `fetch` calls — instead `assertOk`
 * (in `lib/api/_utils.ts`) navigates here on any 5xx response.
 */
export default function ServerErrorPage() {
  return (
    <main className="flex flex-1 items-center justify-center m-5">
      <Card className="w-80 flex flex-col items-center gap-2 text-center">
        <p className="font-serif text-6xl text-danger-0">500</p>
        <p className="font-bold">Something went wrong on our side.</p>
        <p className="text-text-1">
          We hit an unexpected error. Try again in a moment, or head back to
          your lists.
        </p>

        {/* Mirrors `Button`'s default variant styles, as a link */}
        <Link href="/" className="cursor-pointer rounded bg-accent-0 px-4 py-2">
          Back to lists
        </Link>
      </Card>
    </main>
  );
}
