import jwt from "jsonwebtoken";
import { assertEnvVar } from "./environment";

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;

assertEnvVar("JWT_ACCESS_SECRET", JWT_ACCESS_SECRET);
assertEnvVar("JWT_ACCESS_EXPIRES_IN", JWT_ACCESS_EXPIRES_IN);
assertEnvVar("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
assertEnvVar("JWT_REFRESH_EXPIRES_IN", JWT_REFRESH_EXPIRES_IN);

type TokenPayload = {
  id: string;
  email: string;
};

function makeToken(
  payload: Record<string, string>,
  secret: string,
  expiresIn: string,
) {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  return token;
}

export function makeAccessToken(payload: Record<string, string>) {
  return makeToken(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN!);
}

export function makeRefreshToken() {
  return makeToken({}, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN!);
}

export function requireAccess(req: Request): TokenPayload | null {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) return null;

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET!);

    return payload as TokenPayload;
  } catch {
    return null;
  }
}
