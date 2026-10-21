import { db } from "@/app/api/_db";

import { usersTable } from "@/app/api/_db/schema";

export async function GET() {
  const users = await db.select().from(usersTable);

  return Response.json({ data: users });
}
