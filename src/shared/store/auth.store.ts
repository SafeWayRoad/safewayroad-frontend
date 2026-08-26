import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  phone: string | null;
  email: string | null;
  accountStatus: string;
  role: string;
  companyId: string | null;
  teamId: string | null;
  isActive: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;
}

/**
 * Persisted to localStorage (key: "safewayroad-auth"). Chosen over
 * in-memory-only storage because a PWA that forgets the session on every
 * reload would be poor UX for the pilot; the backend has no httpOnly-cookie
 * flow anyway (tokens are returned as plain JSON, cf. auth.service.ts), so
 * localStorage isn't giving up meaningfully more security than the
 * alternative here. Revisit if XSS-hardening becomes a priority pre-launch.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: "safewayroad-auth" },
  ),
);
