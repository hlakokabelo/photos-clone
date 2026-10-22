import { getToken } from "../lib/tokenStore";

const BASE = (
  import.meta.env.VITE_API_URL ?? "https://photos-clone-api.onrender.com"
).replace(/\/+$/, "");

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response from server.");
  }
}

export const getApiUrl = (path: string) => `${BASE}${path}`;
