export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => fetchJSON<T>(path),
  post: <T>(path: string, body: unknown) =>
    fetchJSON<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    fetchJSON<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    fetchJSON<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    fetchJSON<T>(path, { method: "DELETE" }),
};
