import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";

import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/lists/[id]">,
) {
  const { id } = await ctx.params;
  const list = await req.json();

  if (list.id) delete list.id;

  await db
    .update(listsTable)
    .set(list)
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
