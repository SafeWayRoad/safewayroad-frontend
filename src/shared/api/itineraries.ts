import { authFetch } from "@/shared/lib/auth-fetch";
import type { Incident } from "./incidents";
import type { RouteLineString } from "@/shared/components/MapView";

export interface Itinerary {
  id: string;
  userId: string;
  isFavorite: boolean;
  createdAt: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  /** null until the backend fix exposing the stored path is deployed (cf. issue "expose-itinerary-path"). */
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
