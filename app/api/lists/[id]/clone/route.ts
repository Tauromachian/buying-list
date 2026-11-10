import { and, eq, sql } from "drizzle-orm";
import { db } from "@/app/api/_db";
import { listsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { requireAccess } from "@/utils/jwt";

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/lists/[id]/clone">,
) {
  const tokenPayload = requireAccess(req);
  if (!tokenPayload) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "list");

  try {
    const owned = await db
      .select({ id: listsTable.id })
      .from(listsTable)
      .where(
        and(
          eq(listsTable.id, id),
          eq(listsTable.userId, Number(tokenPayload.id)),
        ),
      );

    if (owned.length === 0) {
      return Response.json({ message: "List not found" }, { status: 404 });
    }

    await db.execute(sql`select public.clone_list(${id})`);

    return Response.json({ message: "Clone Successful" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/lists/:id/clone] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
