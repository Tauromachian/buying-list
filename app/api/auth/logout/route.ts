import { db } from "@/app/api/_db";

import jwt from "jsonwebtoken";

import { assertEnvVar } from "@/utils/environment";
import { cookies } from "next/headers";
import { sessionsTable } from "../../_db/schema";
import { eq } from "drizzle-orm";

const { JWT_REFRESH_SECRET } = process.env;

assertEnvVar("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);

export async function POST() {
  const cookiesStore = await cookies();
  const refreshToken = cookiesStore.get("refreshToken");

  if (!refreshToken?.value) return new Response(null, { status: 204 });

  try {
    jwt.verify(refreshToken.value, JWT_REFRESH_SECRET!);
  } catch {
    cookiesStore.delete("refreshToken");
    return new Response(null, { status: 204 });
  }

  try {
    await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.token, refreshToken.value));
  } catch (error) {
    console.error("[POST /api/auth/logout DB failure]", error);
    return Response.json({ message: "DB Error" }, { status: 500 });
  }

  cookiesStore.delete("refreshToken");
  return new Response(null, { status: 204 });
}
