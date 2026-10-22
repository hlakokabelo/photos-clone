import { request } from "./apiClient";

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const data = await request<Record<string, unknown>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const token = data?.token ?? data?.accessToken ?? data?.jwt;

  if (typeof token !== "string" || !token.trim()) {
    throw new Error("No JWT found in the login response.");
  }

  return token.trim();
}

export function register(username: string, password: string) {
  return request<Record<string, unknown>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
