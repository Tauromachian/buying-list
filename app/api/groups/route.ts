import { db } from "@/app/api/_db";
import { groupsTable } from "../_db/schema";

export async function GET() {
  try {
    const groups = db.select().from(groupsTable);

    return Response.json({ data: groups });
  } catch (error) {
    return Response.json(
      { message: "[GET /api/lists] DB failure:" },
      { status: 500 },
    );
  }
}
