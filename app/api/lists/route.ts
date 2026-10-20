import { db } from "@/app/_db";

import { flattenError } from "zod";

import { listsTable } from "@/app/_db/schema";
import { ListDTO } from "@/app/api/_dtos/list";

export async function GET() {
  const lists = await db.select().from(listsTable);

  return Response.json(lists);
}

export async function POST(req: Request) {
  try {
    var reqData = await req.json();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Data invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = ListDTO.omit({ id: true, createdAt: true }).safeParse(reqData);

  if (!result.success) {
    return Response.json(
      {
        message: "Some of the fields aren't valid",
        details: flattenError(result.error),
      },
      { status: 400 },
    );
  }

  const list = result.data;

  const [inserted] = await db.insert(listsTable).values(list).returning();

  return Response.json(
    { message: "Inserted successfully", data: inserted },
    { status: 201 },
  );
}
