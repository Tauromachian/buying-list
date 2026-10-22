import { flattenError } from "zod";
import { db } from "@/app/api/_db";

import { groupsTable } from "@/app/api/_db/schema";
import { CreateGroupDTO } from "@/lib/dto/group";

export async function GET() {
  try {
    const groups = await db.select().from(groupsTable).orderBy(groupsTable.id);

    return Response.json({ data: groups });
  } catch (error) {
    console.error("[GET /api/groups] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let reqData: unknown;
  try {
    reqData = await req.json();
  } catch (error) {
    console.error("[POST /api/groups] Malformed JSON body:", error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = CreateGroupDTO.safeParse(reqData);

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
      .insert(groupsTable)
      .values(result.data)
      .returning();

    return Response.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/groups] DB failure:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
