import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Incident } from "@/shared/api/incidents";
import {
  formatIncidentAge,
  isIncidentStale,
} from "@/shared/lib/format-incident-age";
import { createConfirmation } from "@/shared/api/confirmations";

interface IncidentDetailCardProps {
  incident: Incident;
  onClose: () => void;
  /** Called after a confirmation is successfully sent — lets the parent refetch/close as needed. */
  onConfirmed?: () => void;
  className?: string;
}

export function IncidentDetailCard({
  incident,
  onClose,
  onConfirmed,
  className,
}: IncidentDetailCardProps) {
  const { t } = useTranslation("incidents");
  const stale = isIncidentStale(incident.reportedAt);

  const confirmMutation = useMutation({
    mutationFn: (type: "STILL_THERE" | "CLEARED") =>
      createConfirmation(incident.id, type),
    onSuccess: () => onConfirmed?.(),
  });

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

      {/* Duration indicator, emphasized past the alert threshold (cahier des charges §4.4). */}
      <p
        className={`mt-2 text-xs ${stale ? "font-semibold text-red-600" : "text-slate-500"}`}
      >
        {formatIncidentAge(incident.reportedAt, t)}
        {stale ? ` — ${t("detail.stale_warning")}` : ""}
      </p>

      {incident.photoUrl && (
        <img
          src={incident.photoUrl}
          alt=""
          className="mt-2 h-32 w-full rounded object-cover"
        />
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => confirmMutation.mutate("STILL_THERE")}
          disabled={confirmMutation.isPending}
          className="flex-1 rounded bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("detail.confirm_still_there")}
        </button>
        <button
          type="button"
          onClick={() => confirmMutation.mutate("CLEARED")}
          disabled={confirmMutation.isPending}
          className="flex-1 rounded bg-green-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("detail.confirm_cleared")}
        </button>
      </div>
      {confirmMutation.isSuccess && (
        <p className="mt-2 text-xs text-green-700">
          {t("detail.confirm_success")}
        </p>
      )}
      {confirmMutation.isError && (
        <p className="mt-2 text-xs text-red-600">
          {confirmMutation.error instanceof Error
            ? confirmMutation.error.message
            : t("detail.confirm_error")}
        </p>
      )}
    </div>
  );
}
