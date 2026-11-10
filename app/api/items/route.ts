import { and, eq, inArray } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { flattenError } from "zod";

import { db } from "@/app/api/_db";
import { itemsTable, listsTable } from "@/app/api/_db/schema";
import { CreateItemDTO } from "@/lib/dto/item";
import { requireAccess } from "@/utils/jwt";

export async function GET(req: NextRequest) {
  const tokenPayload = requireAccess(req);
  if (!tokenPayload) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const userId = Number(tokenPayload.id);
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
  try {
    if (listId) {
      const owned = await db
        .select({ id: listsTable.id })
        .from(listsTable)
        .where(and(eq(listsTable.id, listId), eq(listsTable.userId, userId)));

      if (owned.length === 0) {
        return Response.json({ message: "List not found" }, { status: 404 });
      }

      items = await db
        .select()
        .from(itemsTable)
        .where(eq(itemsTable.listId, listId));
    } else {
      const userLists = await db
        .select({ id: listsTable.id })
        .from(listsTable)
        .where(eq(listsTable.userId, userId));

      const ids = userLists.map((list) => list.id);

      items =
        ids.length > 0
          ? await db
              .select()
              .from(itemsTable)
              .where(inArray(itemsTable.listId, ids))
          : [];
    }
  } catch (error) {
    console.error("[GET /api/items] DB failure:", error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }

  return Response.json({ data: items });
}

export async function POST(req: Request) {
  const tokenPayload = requireAccess(req);
  if (!tokenPayload) {
    return Response.json({ message: "Not Authenticated" }, { status: 401 });
  }

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
    const owned = await db
      .select({ id: listsTable.id })
      .from(listsTable)
      .where(
        and(
          eq(listsTable.id, item.listId),
          eq(listsTable.userId, Number(tokenPayload.id)),
        ),
      );

    if (owned.length === 0) {
      return Response.json({ message: "List not found" }, { status: 404 });
    }

    const [inserted] = await db.insert(itemsTable).values(item).returning();
    return Response.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
