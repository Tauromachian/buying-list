import { db } from "@/app/api/_db";
import { sql } from "drizzle-orm";

export async function POST(
  _: Request,
  ctx: RouteContext<"/api/lists/[id]/clone">,
) {
  const { id } = await ctx.params;

  try {
    await db.execute(sql`select public.clone_list(${id})`);

    return Response.json({ message: "Clone Successful" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/lists/:id/clone] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
