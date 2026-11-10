import { db } from "@/app/api/_db";
import { usersGroupsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { requireAccess } from "@/utils/jwt";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  ctx: RouteContext<"/api/groups/[id]/users/[userId]">,
) {
  if (!requireAccess(req)) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const { id: rawGroupId, userId: rawUserId } = await ctx.params;

  const groupId = parseId(rawGroupId);
  const userId = parseId(rawUserId);

  if (!groupId) return invalidId(rawGroupId);
  if (!userId) return invalidId(rawUserId);

  try {
    await db
      .delete(usersGroupsTable)
      .where(
        and(
          eq(usersGroupsTable.groupId, groupId),
          eq(usersGroupsTable.userId, userId),
        ),
      );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/groups/[id]/users/[userId]] DB failure:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
