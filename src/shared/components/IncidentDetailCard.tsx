import { useTranslation } from "react-i18next";
import type { Incident } from "@/shared/api/incidents";
import { formatIncidentAge } from "@/shared/lib/format-incident-age";

interface IncidentDetailCardProps {
  incident: Incident;
  onClose: () => void;
  className?: string;
}

export function IncidentDetailCard({
  incident,
  onClose,
  className,
}: IncidentDetailCardProps) {
  const { t } = useTranslation("incidents");

  return (
    <div
      className={
        className ?? "rounded-lg border border-slate-200 bg-white p-4 shadow-lg"
      }
    >
      <button
        onClick={onClose}
        className="float-right text-slate-400 hover:text-slate-600"
        aria-label={t("detail.close")}
      >
        ✕
      </button>
      <p className="text-sm font-semibold">
        {t(`types.${incident.incidentTypeLabel.toLowerCase()}`)}
      </p>
      <p className="text-xs text-slate-500">
        {incident.axisCode}
        {incident.pkStart != null ? ` — PK ${incident.pkStart}` : ""}
      </p>
      <p className="mt-2 text-sm">
        {t(`directions.${incident.direction.toLowerCase()}`)}
      </p>
      <p className="text-sm">
        {t(`road_statuses.${incident.roadStatus.toLowerCase()}`)}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {formatIncidentAge(incident.reportedAt, t)}
      </p>
      {incident.photoUrl && (
        <img
          src={incident.photoUrl}
          alt=""
          className="mt-2 h-32 w-full rounded object-cover"
        />
      )}
    </div>
  );
}
