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

export async function isUserAuthenticated(req: Request) {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) return false;

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    jwt.verify(token, JWT_ACCESS_SECRET!);
    return true;
  } catch {
    return false;
  }
}

export function getTokenPayload(req: Request): TokenPayload {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) {
    throw new Error("Authorization header is required to get the user payload");
  }

  const token = authorizationHeader.replace("Bearer ", "");

  const user = jwt.decode(token);

  return user as TokenPayload;
}
