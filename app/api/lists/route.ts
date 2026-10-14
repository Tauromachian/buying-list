import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";

export async function GET() {
  const lists = await db.select().from(listsTable);

  return Response.json(lists);
}

export async function POST(req: Request) {
  const list = await req.json();

  await db.insert(listsTable).values(list);

  return Response.json({ msg: "Success" });
}
