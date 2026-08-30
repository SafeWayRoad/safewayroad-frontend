import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MapView, type IncidentMarkerData } from "@/shared/components/MapView";
import { IncidentDetailCard } from "@/shared/components/IncidentDetailCard";
import {
  createItinerary,
  markItineraryFavorite,
  type Itinerary,
} from "@/shared/api/itineraries";
import { useAuthStore } from "@/shared/store/auth.store";
import { ROAD_STATUS_COLORS } from "@/shared/lib/incident-colors";

type SelectingField = "origin" | "destination" | null;

const pickButtonClass = (active: boolean) =>
  `rounded px-3 py-2 text-sm font-medium ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`;

// Phase 2 task #3. POST /itineraries requires an account (Itinerary.userId
// is non-nullable) — the auth UI (prerequisite task) is already merged.
// name is required by the backend since the 28/08/2026 decision (anticipates
// Phase 3 trip assignment) — collected here before the itinerary is created,
// not patched in afterward.
export function PlanTripPage() {
  const { t } = useTranslation("itinerary");
  const user = useAuthStore((state) => state.user);

  const [tripName, setTripName] = useState("");
  const [selectingField, setSelectingField] =
    useState<SelectingField>("origin");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  const calculateMutation = useMutation({
    mutationFn: async () => {
      if (!tripName.trim()) {
        throw new Error(t("trip_name_required"));
      }
      if (!origin || !destination) {
        throw new Error(t("origin_destination_required"));
      }
      return createItinerary({
        name: tripName.trim(),
        origin: { latitude: origin.lat, longitude: origin.lng },
        destination: { latitude: destination.lat, longitude: destination.lng },
      });
    },
    onSuccess: (result) => setItinerary(result),
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!itinerary) {
        throw new Error("No itinerary to favorite");
      }
      return markItineraryFavorite(itinerary.id);
    },
    onSuccess: (result) => setItinerary(result),
  });

  const markers: IncidentMarkerData[] = useMemo(() => {
    const list: IncidentMarkerData[] = [];
    if (origin)
      list.push({
        id: "origin",
        position: [origin.lng, origin.lat],
        color: "#16a34a",
      });
    if (destination) {
      list.push({
        id: "destination",
        position: [destination.lng, destination.lat],
        color: "#dc2626",
      });
    }
    for (const incident of itinerary?.incidentsOnRoute ?? []) {
      list.push({
        id: incident.id,
        position: [incident.longitude, incident.latitude],
        color: ROAD_STATUS_COLORS[incident.roadStatus],
        onClick: () => setSelectedIncidentId(incident.id),
      });
    }
    return list;
  }, [origin, destination, itinerary]);

  const selectedIncident =
    itinerary?.incidentsOnRoute.find(
      (incident) => incident.id === selectedIncidentId,
    ) ?? null;

  // POST /itineraries requires auth — point to the login/register screen
  // rather than letting the request fail with a 401 after the fact.
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <p className="text-sm text-slate-600">{t("login_required")}</p>
        <Link
          to="/login"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {t("go_to_login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 md:flex-row md:overflow-hidden">
      <div className="flex w-full flex-col gap-4 md:w-96 md:shrink-0">
        <h1 className="text-lg font-semibold">{t("plan_trip_heading")}</h1>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t("trip_name")}</span>
          <input
            type="text"
            value={tripName}
            onChange={(event) => setTripName(event.target.value)}
            placeholder={t("trip_name_placeholder")}
            maxLength={120}
            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("select_points_hint")}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectingField("origin")}
              className={pickButtonClass(selectingField === "origin")}
            >
              {t("origin")}
              {origin ? " ✓" : ""}
            </button>
            <button
              type="button"
              onClick={() => setSelectingField("destination")}
              className={pickButtonClass(selectingField === "destination")}
            >
              {t("destination")}
              {destination ? " ✓" : ""}
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={
            !tripName.trim() ||
            !origin ||
            !destination ||
            calculateMutation.isPending
          }
          onClick={() => calculateMutation.mutate()}
          className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {calculateMutation.isPending ? t("calculating") : t("calculate")}
        </button>

        {calculateMutation.isError && (
          <p className="text-sm text-red-600">
            {calculateMutation.error instanceof Error
              ? calculateMutation.error.message
              : t("error_generic")}
          </p>
        )}

        {itinerary && (
          <button
            type="button"
            onClick={() => favoriteMutation.mutate()}
            disabled={itinerary.isFavorite || favoriteMutation.isPending}
            className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {itinerary.isFavorite ? t("already_favorite") : t("save_favorite")}
          </button>
        )}
        {favoriteMutation.isError && (
          <p className="text-sm text-red-600">
            {favoriteMutation.error instanceof Error
              ? favoriteMutation.error.message
              : t("error_generic")}
          </p>
        )}

        {selectedIncident && (
          <IncidentDetailCard
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
            onConfirmed={() => {
              // Unlike MapPage, there's no query to invalidate here — the
              // incident list is embedded in the already-computed itinerary
              // response, not a standalone fetch. Closing the panel avoids
              // showing stale confirm buttons; a full re-resolution would
              // require recalculating the itinerary, out of scope here.
              setSelectedIncidentId(null);
            }}
          />
        )}
      </div>

      <div className="h-64 w-full shrink-0 md:h-full md:flex-1">
        <MapView
          markers={markers}
          route={itinerary?.pathGeoJson ?? null}
          onClick={(lngLat) => {
            if (selectingField === "origin") {
              setOrigin({ lat: lngLat.lat, lng: lngLat.lng });
              setSelectingField("destination");
            } else if (selectingField === "destination") {
              setDestination({ lat: lngLat.lat, lng: lngLat.lng });
              setSelectingField(null);
            }
          }}
        />
      </div>
    </div>
  );
}
