/**
 * Client-side transport for the groups resource.
 *
 * Speaks the contracts in `lib/dto/group`; throws on any non-ok response
 * (and on network failure), leaving the caller in charge of what the UI does.
 *
 * This module is browser-bound (relative-URL fetches). Import types only
 * from `lib/dto` so the zod schemas never reach the client bundle.
 */

import type { CreateGroup, Group, UpdateGroup } from "@/lib/dto/group";
import { handleResponseError } from "./_utils";

/** GET /api/groups — responds with the `{ data: … }` envelope. */
export async function getGroups(): Promise<Group[]> {
  const res = await fetch("/api/groups");
  handleResponseError(res);

  const { data } = (await res.json()) as { data: Group[] };
  return data;
}

/** POST /api/groups — expects the `{ data: … }` envelope. */
export async function createGroup(data: CreateGroup): Promise<Group> {
  const res = await fetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  handleResponseError(res);

  const { data: inserted } = (await res.json()) as { data: Group };
  return inserted;
}

/** PATCH /api/groups/[id] */
export async function updateGroup(
  id: number,
  data: UpdateGroup,
): Promise<void> {
  const res = await fetch(`/api/groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  handleResponseError(res);
}

/** DELETE /api/groups/[id] */
export async function deleteGroup(id: number): Promise<void> {
  const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });
  handleResponseError(res);
}
