import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MapView } from "@/shared/components/MapView";
import { compressImage } from "@/shared/lib/compress-image";
import {
  submitIncident,
  type Direction,
  type IncidentTypeLabel,
  type RoadStatus,
} from "./report-incident.api";

const INCIDENT_TYPES: IncidentTypeLabel[] = [
  "ACCIDENT",
  "BREAKDOWN",
  "OBSTACLE",
  "INSECURITY",
  "MEDICAL_EMERGENCY",
];
const DIRECTIONS: Direction[] = ["OUTBOUND", "RETURN", "BOTH"];
const ROAD_STATUSES: RoadStatus[] = ["BLOCKED", "PARTIAL", "CLEAR"];

const selectClass = "rounded border border-slate-300 px-2 py-1.5 text-sm";
const labelClass = "text-sm font-medium";

// Phase 2 task #1. Reporting stays accessible without an account (cf.
// cahier des charges §4.3) — no auth wiring here, matching POST /incidents.
export function ReportIncidentPage() {
  const { t } = useTranslation("incidents");
  const { t: tCommon } = useTranslation("common");

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [incidentTypeLabel, setIncidentTypeLabel] =
    useState<IncidentTypeLabel>("ACCIDENT");
  const [direction, setDirection] = useState<Direction>("BOTH");
  const [roadStatus, setRoadStatus] = useState<RoadStatus>("BLOCKED");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!position) {
        throw new Error(t("form.position_required"));
      }
      // Compression happens right before submit, not on file selection —
      // avoids compressing a photo the person might still swap out.
      const photo = photoFile ? await compressImage(photoFile) : null;
      return submitIncident({
        incidentTypeLabel,
        direction,
        roadStatus,
        latitude: position.lat,
        longitude: position.lng,
        photo,
      });
    },
  });

  const useMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoError(t("form.geolocation_unsupported"));
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError(t("form.geolocation_denied")),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [t]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 md:flex-row md:overflow-hidden">
      <form
        className="flex w-full flex-col gap-4 md:w-96 md:shrink-0"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <h1 className="text-lg font-semibold">{t("report_incident")}</h1>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>{t("form.position")}</span>
          <button
            type="button"
            onClick={useMyLocation}
            className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            {t("form.use_my_location")}
          </button>
          <p className="text-xs text-slate-500">{t("form.or_tap_map")}</p>
          {position && (
            <p className="text-xs text-slate-500">
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
          )}
          {geoError && <p className="text-xs text-red-600">{geoError}</p>}
        </div>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>{t("form.incident_type")}</span>
          <select
            value={incidentTypeLabel}
            onChange={(event) =>
              setIncidentTypeLabel(event.target.value as IncidentTypeLabel)
            }
            className={selectClass}
          >
            {INCIDENT_TYPES.map((value) => (
              <option key={value} value={value}>
                {t(`types.${value.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>{t("form.direction")}</span>
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value as Direction)}
            className={selectClass}
          >
            {DIRECTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`directions.${value.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>{t("form.road_status")}</span>
          <select
            value={roadStatus}
            onChange={(event) =>
              setRoadStatus(event.target.value as RoadStatus)
            }
            className={selectClass}
          >
            {ROAD_STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`road_statuses.${value.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>{t("form.photo")}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <p className="text-xs text-slate-500">{t("form.photo_hint")}</p>
        </label>

        <button
          type="submit"
          disabled={!position || mutation.isPending}
          className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? t("form.submitting") : t("form.submit")}
        </button>

        {mutation.isSuccess && (
          <p className="text-sm text-green-700">{t("form.success")}</p>
        )}
        {mutation.isError && (
          <p className="text-sm text-red-600">
            {mutation.error instanceof Error
              ? mutation.error.message
              : tCommon("errors.generic")}
          </p>
        )}
      </form>

      <div className="h-64 w-full shrink-0 md:h-full md:flex-1">
        <MapView
          markerPosition={position ? [position.lng, position.lat] : null}
          onClick={(lngLat) =>
            setPosition({ lat: lngLat.lat, lng: lngLat.lng })
          }
        />
      </div>
    </div>
  );
}
