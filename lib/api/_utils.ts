import { GeneralResNotOk } from "@/utils/errors";

const SERVER_ERROR_PAGE = "/server-error";

/**
 * Throws when the response carries an HTTP error status (4xx).
 *
 * 5xx answers never reach callers: we navigate to the dedicated
 * /server-error page and then throw to unwind (otherwise the caller
 * would keep going and feed the error body to `res.json()`).
 */
export function handleResponseError(res: Response) {
  if (res.status >= 500) {
    window.location.replace(SERVER_ERROR_PAGE);
    throw new GeneralResNotOk(res);
  }

  if (!res.ok) throw new GeneralResNotOk(res);
}
