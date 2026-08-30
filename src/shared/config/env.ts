import { z } from "zod";

// Mirrors the backend's src/shared/config/env.ts pattern (Zod validation,
// fail fast at startup) — Vite only exposes variables prefixed VITE_ to the
// client bundle. Never put a secret key here: everything in import.meta.env
// ends up in the shipped JS, readable by anyone. The ORS_API_KEY in
// particular stays server-side only, behind RoutingProvider.
//
// VITE_GOOGLE_CLIENT_ID is safe to expose client-side (OAuth Client IDs are
// public by design — the backend verifies the ID token's signature, not the
// client ID's secrecy). Same Client ID as the backend's GOOGLE_CLIENT_ID.
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:3000"),
  VITE_MAPTILER_API_KEY: z.string().min(1, "VITE_MAPTILER_API_KEY is required"),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, "VITE_GOOGLE_CLIENT_ID is required"),
});

export const env = envSchema.parse(import.meta.env);
