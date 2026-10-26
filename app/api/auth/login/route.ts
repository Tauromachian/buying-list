import { flattenError } from "zod";
import { hash } from "@node-rs/argon2";

import { db } from "@/app/api/_db";

import { usersTable } from "@/app/api/_db/schema";
import { CreateUserDTO } from "@/lib/dto/user";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();

  const result = CreateUserDTO.safeParse(body);

  if (!result.success) {
    return Response.json(
      { message: "Data invalid", details: flattenError(result.error) },
      { status: 400 },
    );
  }

  const user = result.data;
  user.password = await hash(user.password);

  try {
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email));

    if (!dbUser || user.password !== dbUser.password) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    } else {
      return Response.json({ message: "Successful login" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "[POST /api/auth/login]" },
      { status: 500 },
    );
  }
}
