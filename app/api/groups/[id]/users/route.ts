import { db } from "@/app/api/_db";
import { usersGroupsTable } from "@/app/api/_db/schema";
import { invalidId } from "@/app/api/_utils/ids";
import { requireAccess } from "@/utils/jwt";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/groups/[id]/users">,
) {
  if (!requireAccess(req)) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (!id) invalidId(id);

  try {
  } catch (error) {}
}

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/groups/[id]/users">,
) {
  if (!requireAccess(req)) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const data = await req.json();

  if (!id) return invalidId(id, "group");

  try {
    await db.insert(usersGroupsTable).values(data);

    return new Response(null, { status: 201 });
  } catch (error) {
    console.error("[POST /api/groups/[id]/users] DB failure:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
