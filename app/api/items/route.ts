import { db } from "@/app/_db";

import { itemsTable } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let listId = searchParams.get("listId");

  const items = await db
    .select()
    .from(itemsTable)
    .where(listId ? eq(itemsTable.listId, Number(listId)) : undefined);

  return Response.json(items);
}

export async function POST(req: Request) {
  const item = await req.json();

  const [inserted] = await db.insert(itemsTable).values(item).returning();

  return Response.json(inserted);
}
