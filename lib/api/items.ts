/**
 * Client-side transport for the items resource.
 *
 * Speaks the contracts in `lib/dto/item`; throws on any non-ok response
 * (and on network failure), leaving the caller in charge of what the UI does.
 *
 * This module is browser-bound (relative-URL fetches). Import types only
 * from `lib/dto` so the zod schemas never reach the client bundle.
 */
import type { CreateItem, Item, UpdateItem } from "@/lib/dto/item";
import { handleResponseError } from "./_utils";

/** GET /api/items?listId=… (optional filters) — `{ data: … }` envelope. */
export async function getItems(filters?: {
  listId: string | number;
}): Promise<Item[]> {
  let endpoint = "/api/items";

  if (filters) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      params.set(key, String(value));
    }
    endpoint += `?${params.toString()}`;
  }

  const res = await fetch(endpoint);
  handleResponseError(res);

  const { data } = (await res.json()) as { data: Item[] };
  return data;
}

/** POST /api/items — expects the `{ data: … }` envelope. */
export async function createItem(data: CreateItem): Promise<Item> {
  const res = await fetch("/api/items", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  handleResponseError(res);

  const { data: inserted } = (await res.json()) as { data: Item };
  return inserted;
}

/** PATCH /api/items/[id] */
export async function updateItem(id: number, data: UpdateItem): Promise<void> {
  const res = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  handleResponseError(res);
}

/** DELETE /api/items/[id] */
export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  handleResponseError(res);
}
