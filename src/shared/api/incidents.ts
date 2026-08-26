import { env } from "@/shared/config/env";

export type IncidentTypeLabel =
  | "ACCIDENT"
  | "BREAKDOWN"
  | "OBSTACLE"
  | "INSECURITY"
  | "MEDICAL_EMERGENCY";

export type Direction = "OUTBOUND" | "RETURN" | "BOTH";
export type RoadStatus = "BLOCKED" | "PARTIAL" | "CLEAR";
export type IncidentStatus = "ACTIVE" | "RESOLVED";

// Matches the enriched GET /incidents response (backend issues #7-#8):
// incidentTypeLabel/axisCode/pkStart/pkEnd are joined server-side, the
// client never resolves a cuid() to a readable label itself.
export interface Incident {
  id: string;
  roadSegmentId: string;
  incidentTypeId: string;
  incidentTypeLabel: IncidentTypeLabel;
  axisCode: string;
  pkStart: number | null;
  pkEnd: number | null;
  latitude: number;
  longitude: number;
  direction: Direction;
  roadStatus: RoadStatus;
  photoUrl: string | null;
  status: IncidentStatus;
  reportedAt: string;
  lastConfirmedAt: string;
}

interface ListIncidentsResponse {
  status: true;
  data: Incident[];
}

/**
 * axisCode is applied server-side (cf. backend issue #8) — filtering here
 * genuinely reduces what's downloaded, not just what's displayed, per
 * cahier des charges §7.4.
 */
export async function fetchActiveIncidents(
  axisCode?: string,
): Promise<Incident[]> {
  const url = new URL("/incidents", env.VITE_API_BASE_URL);
  if (axisCode) {
    url.searchParams.set("axisCode", axisCode);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const body = (await response.json()) as ListIncidentsResponse;
  return body.data;
}
