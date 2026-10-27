import { flattenError } from "zod";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

import { db } from "@/app/api/_db";

import { sessionsTable, usersTable } from "@/app/api/_db/schema";
import { LoginDTO } from "@/lib/dto/auth";
import { eq } from "drizzle-orm";

import { parseExpiresIn } from "@/utils/expires-in";
import { assertEnvVar } from "@/utils/environment";

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  NODE_ENV,
} = process.env;

assertEnvVar("JWT_ACCESS_SECRET", JWT_ACCESS_SECRET);
assertEnvVar("JWT_ACCESS_EXPIRES_IN", JWT_ACCESS_EXPIRES_IN);
assertEnvVar("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
assertEnvVar("JWT_REFRESH_EXPIRES_IN", JWT_REFRESH_EXPIRES_IN);

const EXPIRES_IN_SECONDS = parseExpiresIn(JWT_REFRESH_EXPIRES_IN) / 1000;

function makeToken(
  payload: Record<string, string>,
  secret: string,
  expiresIn: string,
) {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });

  return token;
}

function makeAccessToken(payload: Record<string, string>) {
  return makeToken(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN!);
}

function makeRefreshToken() {
  return makeToken({}, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN!);
}

export async function POST(req: Request) {
  try {
    var body = await req.json();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Data Invalid",
        details: error instanceof Error ? error.message : "undefined",
      },
      { status: 400 },
    );
  }

  const result = LoginDTO.safeParse(body);

  if (!result.success) {
    return Response.json(
      { message: "Data invalid", details: flattenError(result.error) },
      { status: 400 },
    );
  }

  const user = result.data;

  try {
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email));

    if (!dbUser || !(await verify(dbUser.password, user.password))) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const accessToken = makeAccessToken({
      id: String(dbUser.id),
      email: dbUser.email,
    });
    const refreshToken = makeRefreshToken();

    const cookiesStore = await cookies();

    cookiesStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRES_IN_SECONDS,
    });

    await db
      .insert(sessionsTable)
      .values({ userId: dbUser.id, token: refreshToken });

    return Response.json(
      { message: "Successful login", data: accessToken },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "[POST /api/auth/login] DB Error" },
      { status: 500 },
    );
  }
}
