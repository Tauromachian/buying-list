/**
 * Parses a dynamic `[id]` segment into a positive integer,
 * matching the `id` contract of the resource DTOs (`z.number().positive()`).
 *
 * Returns `null` for anything that isn't a positive integer
 * (including non-integer strings like `"1.5"`).
 */
export function parseId(rawId: string): number | null {
  const id = Number(rawId);

  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * 400 response to send when `parseId` rejects a dynamic `[id]` segment.
 * `resource` names the entity in the message, e.g. `"list"` or `"item"`.
 */
export function invalidId(rawId: string, resource = "resource") {
  return Response.json(
    { message: `"${rawId}" is not a valid ${resource} id` },
    { status: 400 },
  );
}
