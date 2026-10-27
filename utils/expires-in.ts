const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
  y: 31_556_952_000,
};

/**
 * Parses a duration string in the `jsonwebtoken` `expiresIn` dialect
 * ("15m", "7d", …) into milliseconds.
 *
 * Throws on anything else — a malformed lifetime must crash at boot,
 * never silently mint mismatched expiries.
 */
export function parseExpiresIn(expiresIn: string): number {
  const match = /^(\d+)(ms|s|m|h|d|w|y)$/.exec(expiresIn.trim());

  if (!match) throw new Error(`Invalid expiresIn: "${expiresIn}"`);

  return Number(match[1]) * UNIT_MS[match[2]];
}
