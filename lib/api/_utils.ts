import { GeneralResNotOk } from "@/utils/errors";

/** Throws when the response carries an HTTP error status (4xx/5xx). */
export function assertOk(res: Response) {
  if (!res.ok) throw new GeneralResNotOk(res);
}
