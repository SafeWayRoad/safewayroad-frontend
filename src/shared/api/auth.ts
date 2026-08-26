import { env } from "@/shared/config/env";
import type { AuthUser } from "@/shared/store/auth.store";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface ApiResponse<T> {
  status: true;
  data: T;
}

interface ApiErrorBody {
  status: false;
  error: { message: string };
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${env.VITE_API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new Error(
      errorBody?.error?.message ??
        `Request failed with status ${response.status}`,
    );
  }

  const parsed = (await response.json()) as ApiResponse<T>;
  return parsed.data;
}

export function login(identifier: string, password: string) {
  return postJson<AuthResult>("/auth/login", { identifier, password });
}

export interface RegisterInput {
  phone?: string;
  email?: string;
  password: string;
}

export function register(input: RegisterInput) {
  return postJson<AuthResult>("/auth/register", input);
}

export function refreshAccessToken(refreshToken: string) {
  return postJson<AuthResult>("/auth/refresh", { refreshToken });
}
