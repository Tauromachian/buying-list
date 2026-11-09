import { handleResponseError } from "./_utils";

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<string> {
  const endpoint = "/api/auth/login";

  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  handleResponseError(res);

  const data = await res.json();

  return data.data;
}

export async function logoutApi(): Promise<void> {
  const endpoint = "/api/auth/logout";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  handleResponseError(res);
}
