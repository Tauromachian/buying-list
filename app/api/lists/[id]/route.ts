import { eq } from "drizzle-orm";
import { flattenError } from "zod";
import { db } from "@/app/api/_db";
import { listsTable } from "@/app/api/_db/schema";
import { UpdateListDTO } from "@/lib/dto/list";

function parseId(rawId: string): number | null {
  const id = Number(rawId);

  // Same contract as `ListDTO`'s `id`: a positive integer.
  return Number.isInteger(id) && id > 0 ? id : null;
}

function invalidId(rawId: string) {
  return Response.json(
    { message: `"${rawId}" is not a valid list id` },
    { status: 400 },
  );
}

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/lists/[id]">,
) {
  const id = parseId((await ctx.params).id);
  if (!id) return invalidId((await ctx.params).id);

  let reqData: unknown;
  try {
    reqData = await req.json();
  } catch (error) {
    console.error("[PATCH /api/lists/:id] Malformed JSON body:", error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = UpdateListDTO.safeParse(reqData);

  if (!result.success) {
    return Response.json(
      {
        message: "Some of the fields aren't valid",
        details: flattenError(result.error),
      },
      { status: 400 },
    );
  }

  if (Object.keys(result.data).length === 0) {
    return Response.json({ message: "No fields to update" }, { status: 400 });
  }

  try {
    await db.update(listsTable).set(result.data).where(eq(listsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[PATCH /api/lists/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: RouteContext<"/api/lists/[id]">) {
  const id = parseId((await ctx.params).id);
  if (!id) return invalidId((await ctx.params).id);

  try {
    await db.delete(listsTable).where(eq(listsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/lists/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
