/**
 * Client-side transport for the lists resource.
 *
 * Speaks the contracts in `lib/dto/list`; throws on any non-ok response
 * (and on network failure), leaving the caller in charge of what the UI does.
 *
 * This module is browser-bound (relative-URL fetches). Import types only
 * from `lib/dto` so the zod schemas never reach the client bundle.
 */

import type { CreateList, List, UpdateList } from "@/lib/dto/list";
import { assertOk } from "./_utils";

/** GET /api/lists */
export async function getLists(): Promise<List[]> {
  const res = await fetch("/api/lists");
  assertOk(res);
  return res.json();
}

/** POST /api/lists — expects the `{ data: … }` envelope. */
export async function createList(data: CreateList): Promise<List> {
  const res = await fetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  assertOk(res);

  const { data: inserted } = (await res.json()) as { data: List };
  return inserted;
}

/** PATCH /api/lists/[id] */
export async function updateList(id: number, data: UpdateList): Promise<void> {
  const res = await fetch(`/api/lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  assertOk(res);
}

/** DELETE /api/lists/[id] */
export async function deleteList(id: number): Promise<void> {
  const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
  assertOk(res);
}
