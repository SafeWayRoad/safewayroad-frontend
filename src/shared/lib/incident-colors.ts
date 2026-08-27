import type { RoadStatus } from "@/shared/api/incidents";

export const ROAD_STATUS_COLORS: Record<RoadStatus, string> = {
  BLOCKED: "#dc2626",
  PARTIAL: "#f59e0b",
  CLEAR: "#16a34a",
};
