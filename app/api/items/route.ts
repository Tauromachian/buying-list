import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/app/api/_db";
import { itemsTable, listsTable } from "@/app/api/_db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let listId: string | number | null = searchParams.get("listId");
  listId = Number(listId);

  if (listId != null && Number.isNaN(listId)) {
    return Response.json(
      { msg: "List ID should be a number" },
      { status: 400 },
    );
  }

  let items;
  let lists = [];
  try {
    lists = await db.select().from(listsTable).where(eq(listsTable.id, listId));

    items = await db
      .select()
      .from(itemsTable)
      .where(listId ? eq(itemsTable.listId, listId) : undefined);
  } catch (error) {
    console.error("[GET /api/items/:id] DB failure:", error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }

  if (listId && !lists?.length) {
    return Response.json(
      {
        msg: "List not found",
      },
      { status: 404 },
    );
  }

  return Response.json(items);
}

export async function POST(req: Request) {
  const item = await req.json();

  const [inserted] = await db.insert(itemsTable).values(item).returning();

  return Response.json(inserted, { status: 201 });
}
