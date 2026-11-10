import { GeneralResNotOk, NotFound } from "@/utils/errors";
import { useAuth } from "@/stores/auth";

const SERVER_ERROR_PAGE = "/server-error";

/**
 * Throws when the response carries an HTTP error status (4xx).
 *
 * 5xx answers never reach callers: we navigate to the dedicated
 * /server-error page and then throw to unwind (otherwise the caller
 * would keep going and feed the error body to `res.json()`).
 */
export function handleResponseError(res: Response) {
  if (res.status === 404) {
    throw new NotFound(res);
  }

  if (res.status >= 500) {
    window.location.replace(SERVER_ERROR_PAGE);
    throw new GeneralResNotOk(res);
  }

  if (!res.ok) throw new GeneralResNotOk(res);
}

/** Single-flight refresh: parallel 401s share one POST /api/auth/refresh. */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  const attempt = (async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });

      if (!res.ok) {
        useAuth.getState().clearToken();
        return null;
      }

      const { data } = (await res.json()) as { data: string };
      useAuth.getState().setToken(data);
      return data;
    } catch {
      useAuth.getState().clearToken();
      return null;
    }
  })();

  refreshPromise = attempt;
  const result = await attempt;
  refreshPromise = null;
  return result;
}

/**
 * Authenticated fetch for resource transports.
 *
 * Attaches `Authorization: Bearer <accessToken>` from the memory-only
 * store, retries once after a single-flight refresh on 401, and returns
 * the final response. Error mapping stays with the caller via
 * `handleResponseError` — this only handles the retry.
 */
export async function authFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = useAuth.getState().token;
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(input, { ...init, headers });
  if (res.status !== 401) return res;

  const newToken = await refreshAccessToken();
  if (!newToken) return res;

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `Bearer ${newToken}`);
  res = await fetch(input, { ...init, headers: retryHeaders });
  return res;
}
