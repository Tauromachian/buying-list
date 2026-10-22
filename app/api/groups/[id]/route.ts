import { eq } from "drizzle-orm";
import { flattenError } from "zod";
import { db } from "@/app/api/_db";
import { groupsTable, usersGroupsTable } from "@/app/api/_db/schema";
import { invalidId, parseId } from "@/app/api/_utils/ids";
import { UpdateGroupDTO } from "@/lib/dto/group";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/groups/[id]">,
) {
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "group");

  let reqData: unknown;
  try {
    reqData = await req.json();
  } catch (error) {
    console.error("[PATCH /api/groups/:id] Malformed JSON body:", error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = UpdateGroupDTO.safeParse(reqData);

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
    await db.update(groupsTable).set(result.data).where(eq(groupsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[PATCH /api/groups/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: RouteContext<"/api/groups/[id]">) {
  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return invalidId(rawId, "group");

  try {
    // `users_groups.group_id` has no `ON DELETE cascade`, so memberships
    // must go first or the foreign key blocks the delete.
    await db.delete(usersGroupsTable).where(eq(usersGroupsTable.groupId, id));
    await db.delete(groupsTable).where(eq(groupsTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/groups/:id] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
