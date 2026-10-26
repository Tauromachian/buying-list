import { handleResponseError } from "./_utils";

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<string> {
  const endpoint = "/api/auth/login";

  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-type": "application/json" },
  });

  handleResponseError(res);

  const data = await res.json();

  return data.data;
}
