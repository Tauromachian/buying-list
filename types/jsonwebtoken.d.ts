declare module "jsonwebtoken" {
  import type { KeyObject } from "node:crypto";

  namespace jsonwebtoken {
    export type Algorithm =
      | "HS256"
      | "HS384"
      | "HS512"
      | "RS256"
      | "RS384"
      | "RS512"
      | "ES256"
      | "ES384"
      | "ES512"
      | "PS256"
      | "PS384"
      | "PS512"
      | "none";

    export type Secret =
      | string
      | Buffer
      | KeyObject
      | { key: string | Buffer; passphrase: string };

    export interface JwtPayload {
      iss?: string;
      sub?: string;
      aud?: string | string[];
      exp?: number;
      nbf?: number;
      iat?: number;
      jti?: string;
      [key: string]: unknown;
    }

    export interface SignOptions {
      algorithm?: Algorithm;
      expiresIn?: string | number;
      notBefore?: string | number;
      audience?: string | string[];
      issuer?: string;
      jwtid?: string;
      subject?: string;
      noTimestamp?: boolean;
      header?: Record<string, unknown>;
      keyid?: string;
    }

    export interface VerifyOptions {
      algorithms?: Algorithm[];
      audience?: string | string[] | RegExp;
      issuer?: string | string[];
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      subject?: string | string[];
      clockTimestamp?: number;
      clockTolerance?: number;
      maxAge?: string | number;
    }

    export interface DecodeOptions {
      complete?: boolean;
      json?: boolean;
    }

    /** Base class for all verification failures. */
    export class JsonWebTokenError extends Error {
      inner: Error;
    }

    /** Thrown when `exp` has passed. Carries when it expired. */
    export class TokenExpiredError extends JsonWebTokenError {
      expiredAt: Date;
    }

    /** Thrown when the token is used before `nbf`. */
    export class NotBeforeError extends JsonWebTokenError {
      date: Date;
    }

    /**
     * Synchronously signs a payload. Throws on bad input —
     * prefer the sync form inside route handlers and let it throw.
     */
    export function sign(
      payload: string | Buffer | Record<string, unknown>,
      secretOrPrivateKey: Secret,
      options?: SignOptions,
    ): string;

    /**
     * Synchronously verifies a token, returning the decoded payload.
     * Throws `TokenExpiredError` / `NotBeforeError` / `JsonWebTokenError`
     * — catch and map to 401, never let them reach the client shape.
     */
    export function verify(
      token: string,
      secretOrPublicKey: Secret,
      options?: VerifyOptions,
    ): string | JwtPayload;

    /** Decodes without verifying. Never trust the result for auth. */
    export function decode(
      token: string,
      options?: DecodeOptions,
    ): null | string | JwtPayload;
  }

  export = jsonwebtoken;
}
