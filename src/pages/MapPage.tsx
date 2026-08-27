import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MapView, type IncidentMarkerData } from "@/shared/components/MapView";
import { IncidentDetailCard } from "@/shared/components/IncidentDetailCard";
import { fetchActiveIncidents } from "@/shared/api/incidents";
import { ROAD_STATUS_COLORS } from "@/shared/lib/incident-colors";

// Fixed set for the MVP pilot (cf. cahier des charges §2.1 — N1/N3/N4 are the
// only Routes Nationales in scope). No GET /route-axes endpoint exists to
// fetch this dynamically; revisit if the axis list needs to grow post-pilot.
const AXES = ["N1", "N3", "N4"] as const;

const filterButtonClass = (active: boolean) =>
  `rounded px-3 py-1 text-sm ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

// Phase 2 task #2. GET /incidents already returns axisCode/incidentTypeLabel/
// pkStart/pkEnd (cf. backend issues #7-#8) — no client-side id lookup needed.
export function MapPage() {
  const { t } = useTranslation("incidents");
  const queryClient = useQueryClient();
  const [axisFilter, setAxisFilter] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  const {
    data: incidents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["incidents", axisFilter],
    queryFn: () => fetchActiveIncidents(axisFilter ?? undefined),
  });

  const markers: IncidentMarkerData[] = useMemo(
    () =>
      (incidents ?? []).map((incident) => ({
        id: incident.id,
        position: [incident.longitude, incident.latitude],
        color: ROAD_STATUS_COLORS[incident.roadStatus],
        onClick: () => setSelectedIncidentId(incident.id),
      })),
    [incidents],
  );

  const selectedIncident =
    incidents?.find((incident) => incident.id === selectedIncidentId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <button
          onClick={() => setAxisFilter(null)}
          className={filterButtonClass(axisFilter === null)}
        >
          {t("filters.all_axes")}
        </button>
        {AXES.map((axis) => (
          <button
            key={axis}
            onClick={() => setAxisFilter(axis)}
            className={filterButtonClass(axisFilter === axis)}
          >
            {axis}
          </button>
        ))}
        {isLoading && (
          <span className="text-xs text-slate-400">{t("filters.loading")}</span>
        )}
        {isError && (
          <span className="text-xs text-red-600">{t("filters.error")}</span>
        )}
      </div>

      <div className="relative flex-1">
        <MapView className="h-full w-full" markers={markers} />

        {selectedIncident && (
          <IncidentDetailCard
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
            onConfirmed={() => {
              // A CLEARED confirmation may resolve the incident server-side
              // (cf. CLEARED_RESOLUTION_THRESHOLD) — refetch so it drops out
              // of the ACTIVE list rather than lingering stale on the map.
              queryClient.invalidateQueries({ queryKey: ["incidents"] });
              setSelectedIncidentId(null);
            }}
            className="absolute bottom-4 left-4 right-4 max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg md:right-auto"
          />
        )}
      </div>
    </div>
  );
}
