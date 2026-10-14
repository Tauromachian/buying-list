import { db } from "@/app/_db";

import { usersTable } from "@/app/_db/schema";

export async function GET() {
  const users = await db.select().from(usersTable);

  return Response.json(users);
}
