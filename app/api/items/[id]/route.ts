import { eq } from "drizzle-orm";
import { flattenError } from "zod";
import { db } from "@/app/api/_db";
import { itemsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { UpdateItemDTO } from "@/lib/dto/item";

export async function DELETE(_: Request, ctx: RouteContext<"/api/items/[id]">) {
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "item");

  try {
    await db.delete(itemsTable).where(eq(itemsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/items/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/items/[id]">,
) {
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "item");

  let data: unknown;
  try {
    data = await req.json();
  } catch (error) {
    console.error("[PATCH /api/items/:id] Malformed JSON body:", error);
    return Response.json(
      {
        message: "The request body is not valid JSON",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 400 },
    );
  }

  const result = UpdateItemDTO.safeParse(data);
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
    await db.update(itemsTable).set(result.data).where(eq(itemsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[PATCH /api/items/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
