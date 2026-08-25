import { env } from "@/shared/config/env";

export type IncidentTypeLabel =
  | "ACCIDENT"
  | "BREAKDOWN"
  | "OBSTACLE"
  | "INSECURITY"
  | "MEDICAL_EMERGENCY";

export type Direction = "OUTBOUND" | "RETURN" | "BOTH";
export type RoadStatus = "BLOCKED" | "PARTIAL" | "CLEAR";

export interface SubmitIncidentInput {
  incidentTypeLabel: IncidentTypeLabel;
  direction: Direction;
  roadStatus: RoadStatus;
  latitude: number;
  longitude: number;
  photo?: Blob | null;
}

interface ApiErrorBody {
  status: false;
  error: { message: string };
}

/**
 * Matches the corrected POST /incidents contract (backend issue #1):
 * incidentTypeLabel replaces incidentTypeId, roadSegmentId is resolved
 * server-side — the client never needs to know either cuid().
 */
export async function submitIncident(input: SubmitIncidentInput) {
  const formData = new FormData();
  formData.append("incidentTypeLabel", input.incidentTypeLabel);
  formData.append("direction", input.direction);
  formData.append("roadStatus", input.roadStatus);
  formData.append("latitude", String(input.latitude));
  formData.append("longitude", String(input.longitude));
  if (input.photo) {
    formData.append("photo", input.photo, "incident.jpg");
  }

  const response = await fetch(`${env.VITE_API_BASE_URL}/incidents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new Error(
      body?.error?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}
