import { env } from "@/shared/config/env";
import { useAuthStore } from "@/shared/store/auth.store";

/**
 * fetch wrapper that attaches the Authorization header when a token is
 * available. Plain fetch stays fine for anonymous endpoints (incidents,
 * confirmations) — this is for endpoints behind `authenticate` on the
 * backend, e.g. POST /itineraries (task #3).
 */
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { accessToken } = useAuthStore.getState();
  const headers = new Headers(init.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return fetch(`${env.VITE_API_BASE_URL}${path}`, { ...init, headers });
}
