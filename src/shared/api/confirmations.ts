import { authFetch } from "@/shared/lib/auth-fetch";

export type ConfirmationType = "STILL_THERE" | "CLEARED";

interface ApiErrorBody {
  status: false;
  error: { message: string };
}

/**
 * Confirmable without an account too (backend uses optionalAuthenticate,
 * cf. confirmation.router.ts) — authFetch attaches the Authorization header
 * only when a token exists, so this works identically for anonymous and
 * logged-in users without a separate code path.
 */
export async function createConfirmation(
  incidentId: string,
  type: ConfirmationType,
): Promise<void> {
  const response = await authFetch(`/incidents/${incidentId}/confirmations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
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
}
