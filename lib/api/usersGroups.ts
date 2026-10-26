import { handleResponseError } from "./_utils";

export async function addGroupUser(id: number) {
  const endpoint = `/api/groups/${id}/users`;

  const res = await fetch(endpoint, { method: "POST" });

  handleResponseError(res);
}

export async function removeGroupUser(groupId: number, userId: number) {
  const endpoint = `/api/groups/${groupId}/users/${userId}`;

  const res = await fetch(endpoint, { method: "DELETE" });

  handleResponseError(res);
}
