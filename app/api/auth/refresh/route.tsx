import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/_db";
import { sessionsTable, usersTable } from "@/app/api/_db/schema";

import { makeAccessToken, makeRefreshToken } from "@/utils/jwt";
import { assertEnvVar } from "@/utils/environment";
import { parseExpiresIn } from "@/utils/expires-in";

const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN, NODE_ENV } = process.env;

assertEnvVar("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
assertEnvVar("JWT_REFRESH_EXPIRES_IN", JWT_REFRESH_EXPIRES_IN);

const EXPIRES_IN_SECONDS = parseExpiresIn(JWT_REFRESH_EXPIRES_IN) / 1000;

export async function POST() {
  const cookiesStore = await cookies();

  const refreshToken = cookiesStore.get("refreshToken");

  try {
    if (!refreshToken?.value) throw new Error();

    jwt.verify(refreshToken.value, JWT_REFRESH_SECRET!);
  } catch (error) {
    console.error(error);
    cookiesStore.delete("refreshToken");
    return Response.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 },
    );
  }

  try {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, refreshToken.value));

    if (!session) {
      cookiesStore.delete("refreshToken");
      return Response.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 },
      );
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId));

    if (!user) throw new Error("User does not exist");

    const accessToken = makeAccessToken({
      id: String(user.id),
      email: user.email,
    });
    const newRefreshToken = makeRefreshToken();

    await db
      .update(sessionsTable)
      .set({ token: newRefreshToken })
      .where(eq(sessionsTable.id, session.id));

    cookiesStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor(EXPIRES_IN_SECONDS),
    });

    return Response.json(
      { message: "Success refresh", data: accessToken },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/auth/refresh DB failure]", error);
    return Response.json({ message: "DB Error" }, { status: 500 });
  }
}
