import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";

export async function GET() {
  const lists = await db.select().from(listsTable);

  return Response.json(lists);
}
