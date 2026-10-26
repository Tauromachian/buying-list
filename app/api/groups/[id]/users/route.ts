import { db } from "@/app/api/_db";
import { usersGroupsTable } from "@/app/api/_db/schema";
import { invalidId } from "@/app/api/_utils/ids";

export async function GET(
  _: Request,
  ctx: RouteContext<"/api/groups/[id]/users">,
) {
  const { id } = await ctx.params;

  if (!id) invalidId(id);

  try {
  } catch (error) {}
}

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/groups/[id]/users">,
) {
  const { id } = await ctx.params;
  const data = await req.json();

  if (!id) return invalidId(id, "group");

  try {
    db.insert(usersGroupsTable).values(data);
  } catch (error) {
    return Response.json(
      { message: "[POST /api/groups/[id]/users] DB failure:" },
      { status: 500 },
    );
  }
}
