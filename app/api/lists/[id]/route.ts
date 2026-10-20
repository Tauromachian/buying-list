import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";

import { eq } from "drizzle-orm";
import { ListDTO } from "../../_dtos/list";
import { flattenError } from "zod/v4/core";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/lists/[id]">,
) {
  try {
    var reqData = await req.json();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const { id } = await ctx.params;

  const result = ListDTO.omit({ id: true, createdAt: true }).safeParse(reqData);

  if (!result.success) {
    return Response.json(
      {
        message: "Some of the fields aren't valid",
        details: flattenError(result.error),
      },
      { status: 400 },
    );
  }

  await db
    .update(listsTable)
    .set(result.data)
    .where(eq(listsTable.id, Number(id)));

  const res = new Response(null, { status: 204 });
  return res;
}

export async function DELETE(_: Request, ctx: RouteContext<"/api/lists/[id]">) {
  const { id } = await ctx.params;

  if (!id || Number.isNaN(Number(id))) {
    return Response.json({ message: "ID should be number" }, { status: 400 });
  }

  await db.delete(listsTable).where(eq(listsTable.id, Number(id)));

  const res = new Response(null, { status: 204 });
  return res;
}
