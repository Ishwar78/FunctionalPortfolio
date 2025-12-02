export const API_BASE_URL =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    : ""; // Use relative paths in production

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const fullUrl = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(fullUrl, {
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
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`[API Error] Failed to fetch ${path}`);
      console.error(`[API Debug] Full URL: ${fullUrl}`);
      console.error(`[API Debug] Hostname: ${typeof window !== 'undefined' ? window.location.hostname : 'N/A'}`);
      console.error(`[API Debug] API_BASE_URL: ${API_BASE_URL}`);
    }
    throw error;
  }
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

// Health check function to verify API is accessible
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};
