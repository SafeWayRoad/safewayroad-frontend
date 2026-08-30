import { authFetch } from "@/shared/lib/auth-fetch";
import type { Incident } from "./incidents";
import type { RouteLineString } from "@/shared/components/MapView";

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  pathGeoJson: RouteLineString | null;
  incidentsOnRoute: Incident[];
}

interface ApiResponse<T> {
  status: true;
  data: T;
}

interface ApiErrorBody {
  status: false;
  error: { message: string };
}

async function parseResponse<T>(response: Response): Promise<T> {
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

export interface CreateItineraryInput {
  /** Required by the backend (decision 28/08/2026) — anticipates Phase 3
   * trip assignment, where drivers need to identify trips they didn't
   * name themselves. */
  name: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
}

export async function createItinerary(
  input: CreateItineraryInput,
): Promise<Itinerary> {
  const response = await authFetch("/itineraries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<Itinerary>(response);
}

export async function markItineraryFavorite(id: string): Promise<Itinerary> {
  const response = await authFetch(`/itineraries/${id}/favorite`, {
    method: "POST",
  });
  return parseResponse<Itinerary>(response);
}

/** New: rename an itinerary (owner only) — cf. backend PATCH /itineraries/{id}. */
export async function renameItinerary(
  id: string,
  name: string,
): Promise<Itinerary> {
  const response = await authFetch(`/itineraries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return parseResponse<Itinerary>(response);
}
