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
