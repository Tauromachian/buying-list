import { db } from "@/app/api/_db";
import { usersGroupsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  _: Request,
  ctx: RouteContext<"/api/groups/[id]/users/[userId]">,
) {
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

    return Response.json({ message: "Success delete" }, { status: 204 });
  } catch (error) {
    console.error(error);

    return Response.json;
  }
}
