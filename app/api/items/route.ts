import { db } from "@/app/_db";

import { itemsTable } from "@/app/_db/schema";

export async function GET() {
  const items = await db.select().from(itemsTable);

  return Response.json(items);
}

export async function POST(req: Request) {
  const item = await req.json();

  const [inserted] = await db.insert(itemsTable).values(item).returning();

  return Response.json(inserted);
}
