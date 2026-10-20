import { flattenError } from "zod";
import { db } from "@/app/_db";

import { listsTable } from "@/app/_db/schema";
import { CreateListDTO } from "@/lib/dto/list";

export async function GET() {
  try {
    const lists = await db.select().from(listsTable);

    return Response.json(lists);
  } catch (error) {
    console.error("[GET /api/lists] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let reqData: unknown;
  try {
    reqData = await req.json();
  } catch (error) {
    console.error("[POST /api/lists] Malformed JSON body:", error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = CreateListDTO.safeParse(reqData);

  if (!result.success) {
    return Response.json(
      {
        message: "Some of the fields aren't valid",
        details: flattenError(result.error),
      },
      { status: 400 },
    );
  }

  try {
    const [inserted] = await db
      .insert(listsTable)
      .values(result.data)
      .returning();

    return Response.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/lists] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
