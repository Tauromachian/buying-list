import { eq } from "drizzle-orm";
import { flattenError } from "zod";
import { db } from "@/app/api/_db";
import { listsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { UpdateListDTO } from "@/lib/dto/list";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/lists/[id]">,
) {
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "list");

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
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "list");

  try {
    await db.delete(listsTable).where(eq(listsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/lists/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
