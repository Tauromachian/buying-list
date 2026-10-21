import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { flattenError } from "zod";

import { db } from "@/app/api/_db";
import { itemsTable, listsTable } from "@/app/api/_db/schema";
import { CreateItemDTO } from "@/lib/dto/item";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let listId: string | number | null = searchParams.get("listId");
  listId = Number(listId);

  if (listId != null && Number.isNaN(listId)) {
    return Response.json(
      { message: "List ID should be a number" },
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
        message: "List not found",
      },
      { status: 404 },
    );
  }

  return Response.json({ data: items });
}

export async function POST(req: Request) {
  try {
    var data = await req.json();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Data invalid",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 400 },
    );
  }

  const result = CreateItemDTO.safeParse({
    ...data,
    checked: data?.checked ?? false,
  });
  if (!result.success) {
    return Response.json(
      {
        message: "Some fields were invalid",
        details: flattenError(result.error),
      },
      { status: 400 },
    );
  }

  const item = result.data;

  try {
    const [inserted] = await db.insert(itemsTable).values(item).returning();
    return Response.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
