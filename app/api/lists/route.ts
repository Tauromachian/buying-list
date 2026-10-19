import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";

export async function GET() {
  const lists = await db.select().from(listsTable);

  return Response.json(lists);
}

export async function POST(req: Request) {
  const list = await req.json();

  const [inserted] = await db.insert(listsTable).values(list).returning();

  return Response.json(inserted, { status: 201 });
}
