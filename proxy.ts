// middleware.ts (or proxy.ts on Next 16+)
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { assertEnvVar } from "./utils/environment";

const { JWT_REFRESH_SECRET } = process.env;

assertEnvVar("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);

const publicPaths = [
  "/api/auth/login",
  "/auth",
  "/api/auth/refresh",
  "/server-error",
];

export async function proxy(req: NextRequest) {
  // `proxy` in Next 16+
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const token = req.cookies.get("refreshToken")?.value;

  const url = new URL("/auth", req.url);
  url.searchParams.set("from", pathname);

  if (isPublic) return NextResponse.next();

  if (token) {
    try {
      verify(token, JWT_REFRESH_SECRET!);
      return NextResponse.next();
    } catch {
      req.cookies.delete("refreshToken");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
